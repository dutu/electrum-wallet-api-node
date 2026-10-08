import assert from 'node:assert/strict'
import { inspect } from 'node:util'
import test from 'node:test'
import { ElectrumClient, ElectrumTimeoutError, ElectrumTransportError } from 'electrum-wallet-api-node'

const credentials = { url: 'http://127.0.0.1:7777/', username: 'rpc-user', password: 'rpc-password' }

const pendingFetch = (context) => {
  const calls = []
  context.mock.method(globalThis, 'fetch', (url, options) => new Promise((resolve, reject) => {
    calls.push({ url, options })
    options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true })
  }))
  return calls
}

test('local options stay out of named, generic, positional and legacy RPC parameters', async (context) => {
  const calls = []
  context.mock.method(globalThis, 'fetch', async (_, options) => {
    const request = JSON.parse(options.body)
    calls.push(request)
    return Response.json({ jsonrpc: '2.0', id: request.id, result: false })
  })
  const client = new ElectrumClient(credentials)
  const options = Object.freeze({ timeout: 120000, signal: new AbortController().signal })
  assert.equal(await client.lnPay({ invoice: 'invoice', timeout: 10, walletPath: '/wallet' }, options), false)
  await client.addPeer({ connectionString: 'peer', timeout: 5 }, options)
  await client.request('future', { timeout: 7, signal: 'rpc-value' }, options)
  await client.request('future', [1, false], options)
  await client.request('ping', undefined, options)
  await client.history({ walletPath: '/wallet', showFiat: true }, options)
  assert.deepEqual(calls.map(({ params }) => params), [
    { invoice: 'invoice', timeout: 10, wallet_path: '/wallet' },
    { connection_string: 'peer', timeout: 5 },
    { timeout: 7, signal: 'rpc-value' }, [1, false], {},
    { wallet_path: '/wallet', show_fiat: true }
  ])
  assert.deepEqual(Object.keys(options), ['timeout', 'signal'])
})

test('timeouts can be shorter or longer per request and never change the client default', async (context) => {
  context.mock.timers.enable({ apis: ['setTimeout'] })
  const calls = pendingFetch(context)
  const client = new ElectrumClient({ ...credentials, timeout: 100 })
  const shorter = client.getInfo({}, { timeout: 20 })
  const longer = client.request('getinfo', {}, { timeout: 200 })
  const normal = client.getInfo({}, { timeout: undefined })
  const shortCheck = assert.rejects(shorter, (error) => {
    assert.ok(error instanceof ElectrumTimeoutError)
    assert.match(error.message, /20 ms/u)
    return true
  })
  const longCheck = assert.rejects(longer, /200 ms/u)
  const normalCheck = assert.rejects(normal, /100 ms/u)
  context.mock.timers.tick(20)
  assert.deepEqual(calls.map(({ options }) => options.signal.aborted), [true, false, false])
  context.mock.timers.tick(80)
  assert.deepEqual(calls.map(({ options }) => options.signal.aborted), [true, false, true])
  context.mock.timers.tick(100)
  await Promise.all([shortCheck, normalCheck, longCheck])
})

for (const options of [
  null, [], 1, false, 'options',
  { timeout: 0 }, { timeout: -1 }, { timeout: 1.5 }, { timeout: NaN },
  { timeout: Infinity }, { timeout: '100' }, { timeout: null }, { timeout: 2147483648 },
  { signal: null }, { signal: true }, { signal: {} },
  { signal: { aborted: false, addEventListener() {} } },
  { retries: 1 }, { walletPath: '/wallet' }, { [Symbol('option')]: true }
]) {
  test(`invalid request options reject before sending: ${inspect(options)}`, async (context) => {
    const calls = pendingFetch(context)
    const client = new ElectrumClient(credentials)
    await assert.rejects(client.getInfo({}, options), TypeError)
    await assert.rejects(client.request('getinfo', {}, options), TypeError)
    assert.equal(calls.length, 0)
  })
}

test('already aborted signals prevent sending and redact cancellation reasons', async (context) => {
  const calls = pendingFetch(context)
  const controller = new AbortController()
  controller.abort(new Error('rpc-password wallet-secret'))
  const client = new ElectrumClient(credentials)
  await assert.rejects(client.broadcast({ tx: 'tx', password: 'wallet-secret' }, { signal: controller.signal }), (error) => {
    assert.ok(error instanceof ElectrumTransportError)
    assert.ok(!(error instanceof ElectrumTimeoutError))
    assert.match(error.message, /cancelled/u)
    assert.equal(error.cause.message, '[redacted] [redacted]')
    assert.ok(!inspect(error).includes('wallet-secret'))
    return true
  })
  assert.equal(calls.length, 0)
})

test('cancellation uses the AbortSignal interface and does not cancel other requests', async (context) => {
  context.mock.timers.enable({ apis: ['setTimeout'] })
  const calls = pendingFetch(context)
  const controller = new AbortController()
  // An interface implementation avoids relying on instanceof or one JavaScript realm.
  const signal = {
    get aborted() { return controller.signal.aborted },
    get reason() { return controller.signal.reason },
    addEventListener: controller.signal.addEventListener.bind(controller.signal),
    removeEventListener: controller.signal.removeEventListener.bind(controller.signal)
  }
  const client = new ElectrumClient({ ...credentials, timeout: 100 })
  const cancelled = client.getInfo({}, { signal })
  const independent = client.request('ping')
  const cancelledCheck = assert.rejects(cancelled, (error) => {
    assert.ok(error instanceof ElectrumTransportError)
    assert.ok(!(error instanceof ElectrumTimeoutError))
    assert.equal(error.cause.name, 'AbortError')
    return true
  })
  const independentCheck = assert.rejects(independent, ElectrumTimeoutError)
  controller.abort()
  assert.equal(calls[0].options.signal.aborted, true)
  assert.equal(calls[1].options.signal.aborted, false)
  context.mock.timers.tick(100)
  await Promise.all([cancelledCheck, independentCheck])
  assert.equal(calls.length, 2)
})

for (const first of ['cancel', 'timeout']) {
  test(`the first abort wins when ${first} precedes the other source before rejection`, async (context) => {
    context.mock.timers.enable({ apis: ['setTimeout'] })
    const calls = pendingFetch(context)
    const controller = new AbortController()
    const pending = new ElectrumClient(credentials).getInfo({}, { timeout: 10, signal: controller.signal })
    const check = assert.rejects(pending, (error) => {
      assert.equal(error instanceof ElectrumTimeoutError, first === 'timeout')
      assert.match(error.message, first === 'timeout' ? /timed out after 10 ms/u : /cancelled/u)
      return true
    })
    // A caller-provided TimeoutError is still caller cancellation.
    const cancel = () => controller.abort(new DOMException('Caller deadline', 'TimeoutError'))
    if (first === 'cancel') cancel()
    context.mock.timers.tick(10)
    if (first === 'timeout') cancel()
    await check
    assert.equal(calls.length, 1)
  })
}

for (const outcome of ['success', 'network error', 'body error', 'HTTP error', 'RPC error', 'invalid JSON', 'cancel', 'timeout']) {
  test(`request timers and caller listeners are cleaned up after ${outcome}`, async (context) => {
    context.mock.timers.enable({ apis: ['setTimeout'] })
    const controller = new AbortController()
    const added = context.mock.method(controller.signal, 'addEventListener')
    const removed = context.mock.method(controller.signal, 'removeEventListener')
    let internalSignal
    context.mock.method(globalThis, 'fetch', async (_, options) => {
      internalSignal = options.signal
      const request = JSON.parse(options.body)
      if (outcome === 'network error') throw new Error('Offline')
      if (outcome === 'body error') return new Response(new ReadableStream({
        start(controller) { controller.error(new Error('Connection closed')) }
      }))
      if (outcome === 'HTTP error') return new Response('Forbidden', { status: 403 })
      if (outcome === 'invalid JSON') return new Response('{')
      if (outcome === 'cancel' || outcome === 'timeout') {
        return new Promise((resolve, reject) => internalSignal.addEventListener('abort', () => reject(internalSignal.reason), { once: true }))
      }
      return Response.json({ jsonrpc: '2.0', id: request.id,
        ...(outcome === 'RPC error' ? { error: { code: -1, message: 'Failed' } } : { result: true }) })
    })
    const pending = new ElectrumClient(credentials).ping({}, { timeout: 10, signal: controller.signal })
    const check = outcome === 'success' ? pending : assert.rejects(pending, Error)
    if (outcome === 'cancel') controller.abort()
    if (outcome === 'timeout') context.mock.timers.tick(10)
    await check
    assert.equal(added.mock.callCount(), 1)
    assert.equal(removed.mock.callCount(), 1)
    assert.equal(added.mock.calls[0].arguments[1], removed.mock.calls[0].arguments[1])
    controller.abort()
    context.mock.timers.tick(100)
    assert.equal(internalSignal.aborted, outcome === 'cancel' || outcome === 'timeout')
  })
}
