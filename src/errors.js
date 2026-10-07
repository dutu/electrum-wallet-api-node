export class ElectrumError extends Error {
  constructor(message, options) {
    super(message, options)
    this.name = new.target.name
  }
}

export class ElectrumTransportError extends ElectrumError {}

export class ElectrumTimeoutError extends ElectrumTransportError {}

export class ElectrumHttpError extends ElectrumTransportError {
  constructor(method, response, body) {
    super(`Electrum ${method} failed with HTTP ${response.status} ${response.statusText}`.trim())
    this.method = method
    this.status = response.status
    this.statusText = response.statusText
    this.body = body
  }
}

export class ElectrumResponseError extends ElectrumTransportError {}

export class ElectrumRpcError extends ElectrumError {
  constructor(method, response) {
    super(response.error.message)
    this.method = method
    this.code = response.error.code
    this.data = response.error.data
    this.rpcError = response.error
    this.response = response
  }
}
