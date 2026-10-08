import {
  ElectrumClient, ElectrumError, ElectrumTransportError, ElectrumTimeoutError,
  ElectrumHttpError, ElectrumResponseError, ElectrumRpcError,
  type ElectrumClientOptions, type ElectrumRequestOptions, type ElectrumNamedParams, type ElectrumRpcParams
} from 'electrum-wallet-api-node'

const options: ElectrumClientOptions = {
  url: 'http://127.0.0.1:7777', username: 'user', password: 'password', timeout: undefined
}
const client = new ElectrumClient(options)
const balance: { confirmed: string } = await client.getBalance<{ confirmed: string }>({ walletPath: '/wallet' })
const raw: unknown = await client.request('getinfo', {})
const positional: ElectrumRpcParams = ['fee_policy']
await client.request('getconfig', positional)
const params: ElectrumNamedParams = {
  destination: 'address', amount: '0.01000001', fromCoins: 'txid:0', changeAddr: 'change', feeRate: '2', futureOption: undefined
}
const tx: string = await client.payTo<string>(params)
await client.payToMany({ outputs: [['address', '!']], from_coins: 'txid:1' })
await client.signTransaction({ tx, ignoreWarnings: true })
await client.broadcast({ tx })
await client.listUnspent()
await client.getTransaction({ txid: 'txid' })
await client.addHoldInvoice({ paymentHash: 'hash', amount: '0.001' })
await client.runCmdline({ configOptions: { cmd: 'getbalance', wallet_path: '/wallet' } })
await client.history({ showFiat: true })

const requestOptions: ElectrumRequestOptions = { timeout: 120000, signal: new AbortController().signal }
const controlledBalance: { confirmed: string } = await client.getBalance<{ confirmed: string }>({ walletPath: '/wallet' }, requestOptions)
const controlledRaw: boolean = await client.request<boolean>('ping', undefined, requestOptions)
await client.request('getconfig', positional, requestOptions)
await client.waitForSync(undefined, { timeout: undefined, signal: undefined })
await client.history({}, requestOptions)

type Assert<Condition extends true> = Condition
type SameType<A, B> =
  (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false

// Assert every second parameter individually: any missing or mistyped options
// produces false, so the resulting union cannot satisfy the true constraint.
type NamedMethodsHaveRequestOptions = Assert<{
  [Method in Exclude<keyof ElectrumClient, 'request'>]: SameType<
    Parameters<ElectrumClient[Method]>[1], ElectrumRequestOptions | undefined
  >
}[Exclude<keyof ElectrumClient, 'request'>]>

// @ts-expect-error request timeout is a number
await client.getBalance({}, { timeout: '30000' })
// @ts-expect-error signal must implement AbortSignal
await client.request('ping', {}, { signal: {} })
// @ts-expect-error local options are limited to timeout and signal
await client.payTo(params, { retries: 2 })
// @ts-expect-error RPC parameters belong in the first object
await client.getBalance({}, { walletPath: '/wallet' })
// @ts-expect-error options must be an object
await client.request('ping', {}, 30000)

// @ts-expect-error credentials are required
new ElectrumClient({ url: 'http://localhost:7777' })
// @ts-expect-error timeout is a number
new ElectrumClient({ ...options, timeout: '30000' })
// @ts-expect-error named wrappers take an object
await client.payTo(['address', '0.1'])
// @ts-expect-error generic RPC params must be a container
await client.request('getbalance', 'wallet')
const unknownBalance = await client.getBalance()
// @ts-expect-error a result without a supplied type is unknown
const unsafe: { confirmed: string } = unknownBalance

const error: Error = new ElectrumTimeoutError('Timed out')
if (error instanceof ElectrumRpcError) {
  const code: number = error.code
  const data: unknown = error.data
  const message: string = error.rpcError.message
  const id: string = error.response.id
  void [code, data, message, id]
}
if (error instanceof ElectrumHttpError) {
  const status: number = error.status
  const body: string = error.body
  void [status, body]
}
void [balance, raw, controlledBalance, controlledRaw, ElectrumError, ElectrumTransportError, ElectrumResponseError]
