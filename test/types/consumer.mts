import {
  ElectrumClient, ElectrumError, ElectrumTransportError, ElectrumTimeoutError,
  ElectrumHttpError, ElectrumResponseError, ElectrumRpcError,
  type ElectrumClientOptions, type ElectrumNamedParams, type ElectrumRpcParams
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
void [balance, raw, ElectrumError, ElectrumTransportError, ElectrumResponseError]
