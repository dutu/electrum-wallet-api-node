import { Buffer } from 'node:buffer'
import { randomUUID } from 'node:crypto'
import { requireOptions, requireString, requireTimeout, requireRequestOptions } from './options.js'
import { createRedactor, redactCause } from './redact.js'
import {
  ElectrumTransportError,
  ElectrumTimeoutError,
  ElectrumHttpError,
  ElectrumResponseError,
  ElectrumRpcError
} from './errors.js'

const createRpcUrl = function createRpcUrl(value) {
  requireString(value, 'url')
  let url

  try {
    url = new URL(value)
  } catch {
    // URL parsing errors otherwise expose their input, potentially including credentials.
    throw new TypeError('url must be a valid HTTP or HTTPS URL')
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new TypeError('url must use HTTP or HTTPS')
  }

  if (url.username || url.password || url.search || url.hash) {
    throw new TypeError('url cannot contain credentials, a query or a fragment')
  }

  return url.href
}

/** One HTTP JSON-RPC implementation shared by all client methods. */
export class JsonRpcTransport {
  #url
  #authorization
  #timeout
  #secrets

  constructor(options = {}) {
    requireOptions(options)
    const { url, username, password, timeout = 30000 } = options
    this.#url = createRpcUrl(url)
    requireString(username, 'username')
    requireString(password, 'password')

    if (username.includes(':')) {
      throw new TypeError('username cannot contain a colon in HTTP Basic Authentication')
    }

    requireTimeout(timeout)

    const encoded = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')
    this.#authorization = `Basic ${encoded}`
    this.#timeout = timeout
    this.#secrets = [username, password, encoded]
  }

  async request(method, params = {}, options = {}) {
    requireString(method, 'method')
    if (params === null || typeof params !== 'object') {
      throw new TypeError('params must be an object or array')
    }
    const { timeout = this.#timeout, signal: callerSignal } = requireRequestOptions(options)

    const redact = createRedactor([
      ...this.#secrets, params.password, params.new_password, params.newPassword
    ])
    const safeMethod = redact(method)
    const id = randomUUID()
    let body

    try {
      // JSON.stringify omits undefined object properties. Positional holes cannot be omitted safely.
      body = JSON.stringify({ jsonrpc: '2.0', id, method, params }, (key, value) => {
        if (Array.isArray(value) && Array.from(value).some((item) => item === undefined)) {
          throw new TypeError('Positional arrays cannot contain undefined values or holes; use named params')
        }
        return value
      })
    } catch (cause) {
      throw new TypeError('params must be JSON serializable without undefined array entries', {
        cause: redactCause(cause, redact)
      })
    }

    const controller = new AbortController()
    const { signal } = controller
    let abortKind
    const abort = (kind, reason) => {
      // The first event wins, even if both sources abort before fetch rejects.
      if (signal.aborted) return
      abortKind = kind
      controller.abort(reason)
    }
    const onAbort = () => abort('cancel', callerSignal.reason)
    let timer
    let response
    let text

    try {
      if (callerSignal?.aborted) {
        onAbort()
      } else {
        callerSignal?.addEventListener('abort', onAbort, { once: true })
        timer = setTimeout(() => abort('timeout', new DOMException('Request timed out', 'TimeoutError')), timeout)
      }
      signal.throwIfAborted()
      response = await fetch(this.#url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: this.#authorization
        },
        body,
        redirect: 'manual',
        signal
      })
      text = await response.text()
    } catch (cause) {
      const errorOptions = { cause: redactCause(abortKind === 'cancel' ? signal.reason : cause, redact) }
      if (abortKind === 'timeout') {
        throw new ElectrumTimeoutError(`Electrum ${safeMethod} request timed out after ${timeout} ms`, errorOptions)
      }
      if (abortKind === 'cancel') {
        throw new ElectrumTransportError(`Electrum ${safeMethod} request cancelled`, errorOptions)
      }
      throw new ElectrumTransportError(`Electrum ${safeMethod} request failed`, errorOptions)
    } finally {
      clearTimeout(timer)
      callerSignal?.removeEventListener('abort', onAbort)
    }

    if (!response.ok) {
      throw new ElectrumHttpError(safeMethod, {
        status: response.status, statusText: redact(response.statusText)
      }, redact(text))
    }

    let payload

    try {
      payload = JSON.parse(text)
    } catch (cause) {
      throw new ElectrumResponseError(`Electrum ${safeMethod} returned invalid JSON`, {
        cause: redactCause(cause, redact)
      })
    }

    if (payload === null || typeof payload !== 'object' || Array.isArray(payload)
      || payload.jsonrpc !== '2.0' || payload.id !== id) {
      throw new ElectrumResponseError(`Electrum ${safeMethod} returned an invalid JSON-RPC envelope or mismatched ID`)
    }

    const hasResult = Object.hasOwn(payload, 'result')
    const hasError = Object.hasOwn(payload, 'error')

    if (hasError) {
      const error = payload.error

      if (hasResult || error === null || typeof error !== 'object' || Array.isArray(error)
        || !Number.isInteger(error.code) || typeof error.message !== 'string') {
        throw new ElectrumResponseError(`Electrum ${safeMethod} returned an invalid JSON-RPC error`)
      }

      throw new ElectrumRpcError(safeMethod, redact(payload))
    }

    if (!hasResult) {
      throw new ElectrumResponseError(`Electrum ${safeMethod} returned a response without a result or error`)
    }

    return payload.result
  }
}
