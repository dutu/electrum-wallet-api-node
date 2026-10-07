# electrum-wallet-api-node

[![CI](https://github.com/dutu/electrum-wallet-api-node/actions/workflows/ci.yml/badge.svg)](https://github.com/dutu/electrum-wallet-api-node/actions/workflows/ci.yml)

A small, unofficial Node.js client for the Electrum wallet daemon JSON-RPC API.
Requires **Node.js >= 22**. Uses native `fetch` with no runtime dependencies.

**electrum-wallet-api-node wraps the Electrum wallet daemon JSON-RPC API.**
**It does not implement the Electrum server protocol used by electrs or ElectrumX.**

The library maps method and parameter names, sends an RPC request, and returns
Electrum's result unchanged. It adds no wallet models, transaction builders,
coin selection, address management, labeling system, or business logic.

For the authoritative command behavior, see the
[official Electrum command source](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py)
and [daemon RPC source](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/daemon.py).

## Installation

```sh
npm install electrum-wallet-api-node
```

Or with Yarn:

```sh
yarn add electrum-wallet-api-node
```

## Usage

```js
import { ElectrumClient } from 'electrum-wallet-api-node'

const client = new ElectrumClient({
  url: 'http://127.0.0.1:7777',
  username: 'user',
  password: process.env.ELECTRUM_RPC_PASSWORD,
  timeout: 30000
})

const info = await client.getInfo()
const wallets = await client.listWallets()

const walletPath = '/absolute/path/on/daemon/machine/wallet'
await client.loadWallet({ walletPath, password: process.env.ELECTRUM_WALLET_PASSWORD })

const balance = await client.getBalance({ walletPath })
const utxos = await client.listUnspent({ walletPath })
```

`balance`, `utxos`, and all other successful return values are the RPC **result**,
without the JSON-RPC envelope. Returned objects, strings and numbers are otherwise
left unchanged.

## Connection options and authentication

| Option | Default | Description |
| --- | --- | --- |
| `url` | Required | HTTP or HTTPS RPC URL, including the port or reverse-proxy path. URL credentials, query strings and fragments are rejected. |
| `username` | Required | Non-empty Electrum `rpcuser`, sent using HTTP Basic Authentication. Cannot contain `:`. |
| `password` | Required | Non-empty Electrum `rpcpassword`, sent using HTTP Basic Authentication. |
| `timeout` | `30000` | Integer milliseconds between 1 and 2147483647. Covers connection setup and reading the complete response. |

Connection settings are copied at construction and remain fixed. No request is
made until an RPC method is called. HTTPS is supported for a TLS reverse proxy or
gateway; Electrum's native RPC listener uses HTTP.

The HTTP authentication password is separate from an encrypted wallet's password.
Pass a wallet password as the RPC `password` parameter when Electrum requires it,
or use Electrum's `unlock()` command. This wrapper does not unlock wallets
automatically.

## Electrum daemon setup and GUI note

**Normal Electrum mainnet GUI startup exposes only a restricted RPC interface.**
This library targets Electrum running with the **full daemon RPC interface** enabled.
It contains no special GUI handling. In the inspected source, normal mainnet GUI
startup registers only `ping` and `gui`; the daemon startup enables all core
commands. See the [official startup code](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/run_electrum).

Stop an existing Electrum process before changing its RPC listener configuration.
For the inspected Electrum version, a local TCP daemon can be started with:

```sh
electrum daemon -d --rpcsock tcp --rpchost 127.0.0.1 --rpcport 7777
```

Electrum may default to a Unix socket on Unix systems; this client uses HTTP over
TCP, so select TCP explicitly. Older releases may lack `--rpcsock`; consult your
installed version's `electrum daemon --help`.

Use the `rpcuser` and `rpcpassword` from your Electrum configuration. Electrum
generates credentials if they are unset in the inspected version. RPC configuration
must be changed while the daemon is stopped, for example using
`electrum -o setconfig`. The client neither reads Electrum's configuration nor
launches the daemon.

## Calling methods and parameters

All named methods take one parameter object:

```js
await client.getConfig({ key: 'fee_policy' })
await client.setConfig({ key: 'fee_policy', value: 'eta:2' })
await client.listAddresses({ walletPath, receiving: true, unused: true })
await client.getTransaction({ txid: 'transaction-id', walletPath })
```

JavaScript method names use camelCase (`getBalance` → `getbalance`,
`loadWallet` → `load_wallet`). Parameter aliases such as `walletPath` →
`wallet_path` and `feeRate` → `feerate` map directly to Electrum's names.
Original RPC parameter names are also accepted. Unknown parameter names are
forwarded unchanged for version compatibility. Do not supply both spellings of
one parameter.

Only top-level names are mapped. Nested values such as transaction JSON and
`configOptions` retain their original keys. Electrum validates required
arguments, amounts, addresses and command options.

Properties with `undefined` values are omitted, including nested object
properties. Explicit `null`, `false`, `0`, and empty strings are preserved.
The wrapper supplies no command defaults. Arrays containing `undefined` or holes
are rejected rather than silently changing entries to `null`; use named params
to omit an optional RPC argument.

The [complete RPC reference](./docs/rpc-methods.md) lists all method names,
parameters, aliases, source revision and requirements. All **122 core endpoints**
registered by the inspected source have named wrappers, including Lightning,
invoice, channel, swap, configuration and daemon commands. No core endpoint is
excluded. Plugin-defined commands can be called using `request()`.

An additional `history()` method calls the legacy `history` RPC directly for
older Electrum versions. The inspected current source provides `onchainHistory()`
and `lightningHistory()` instead. Commands are never substituted automatically.

## Wallet-related calls

```js
await client.loadWallet({ walletPath, password: process.env.ELECTRUM_WALLET_PASSWORD })
const balance = await client.getBalance({ walletPath })
const addresses = await client.listAddresses({ walletPath, balance: true })
const history = await client.onchainHistory({ walletPath, showAddresses: true })
const synced = await client.isSynchronized({ walletPath })
await client.closeWallet({ walletPath })
```

`walletPath` refers to the daemon's filesystem. Electrum resolves it to a loaded
wallet internally. Omitting it delegates default wallet selection to Electrum.
There is no wrapper-level wallet object or automatic loading/synchronization.
Use `waitForSync()` when needed and choose a timeout suitable for the operation.
`stop()` asks Electrum to stop its daemon.

## Transactions

Create a transaction using Electrum's `payto`, then sign and broadcast explicitly:

```js
const unsignedTx = await client.payTo({
  walletPath,
  destination: 'recipient-bitcoin-address',
  amount: '0.01000001',
  feeRate: '2.5',
  unsigned: true
})

const signedTx = await client.signTransaction({
  walletPath,
  tx: unsignedTx,
  password: process.env.ELECTRUM_WALLET_PASSWORD
})

const txid = await client.broadcast({ tx: signedTx })
```

`payTo()` and `payToMany()` create transactions; they do not broadcast them.
Electrum normally signs them unless `unsigned: true` is passed.
`addTransaction: true` forwards Electrum's option to add the transaction to its
wallet. Signing and serialization behavior is entirely Electrum's.

Multiple recipients use Electrum's output-pair format:

```js
const tx = await client.payToMany({
  walletPath,
  outputs: [
    ['first-recipient-address', '0.01000001'],
    ['second-recipient-address', '0.02000002']
  ],
  feeRate: '2.5',
  unsigned: true
})
```

Use decimal strings when passing BTC amounts or fee rates to avoid introducing
JavaScript floating-point rounding. Electrum's `amount: '!'` maximum-spend syntax
is forwarded unchanged. `fee` is an absolute BTC fee; `feeRate` is sat/vbyte for
these transaction commands. Preserve each RPC's own units: for example,
`getFeeRate()` currently reports a `sat/kvB` field. The library performs no amount
conversion; JSON numeric values are parsed as standard JavaScript numbers, so use
the daemon's string-valued fields where precision matters.

## UTXO selection and change address

```js
const utxos = await client.listUnspent({ walletPath })

const tx = await client.payTo({
  walletPath,
  destination: 'recipient-bitcoin-address',
  amount: '0.01000001',
  fromCoins: 'first-transaction-id:0,second-transaction-id:1',
  changeAddr: 'your-change-bitcoin-address',
  feeRate: '2.5',
  unsigned: true
})
```

`fromCoins` maps to `from_coins`: the inspected Electrum implementation expects
a comma-separated string of `txid:vout` outpoints belonging to the wallet.
`fromAddr` maps to `from_addr` and accepts Electrum's comma-separated source
address string. These values are passed unchanged, without conversion from
arrays or any custom coin-selection rules.

`changeAddr` maps to `change_addr`. When omitted, Electrum chooses change using
its own rules. The application selects UTXOs and change addresses; the wrapper
does not manage them.

## Generic RPC calls

```js
const balance = await client.request('getbalance', { wallet_path: walletPath })
const policy = await client.request('getconfig', ['fee_policy'])
const info = await client.request('getinfo')
```

`request(method, params)` accepts original Electrum method names and named objects
or positional arrays. Omitted params become `{}`. Generic calls do **not** map
camelCase parameter names. For wallet commands, use named `wallet_path` rather
than attempting to serialize Electrum's internal Python `wallet` argument.
This method supports future or plugin RPC commands before named methods are added.
Every named method internally calls the same `request()` implementation.

## Errors

| Error | Meaning | Useful fields |
| --- | --- | --- |
| `TypeError` | Invalid connection settings, method/parameter container, duplicate parameter aliases, or unserializable JSON | `message`, optional sanitized `cause` |
| `ElectrumTransportError` | Connection or response-body read failure | `cause` with sanitized underlying diagnostics |
| `ElectrumHttpError` | Non-2xx HTTP status, including authentication failures and redirects | `method`, `status`, `statusText`, `body` |
| `ElectrumTimeoutError` | Request exceeds `timeout` | `message`, `cause` |
| `ElectrumResponseError` | Invalid JSON, malformed JSON-RPC response, or mismatched request ID | `message`, optional `cause` |
| `ElectrumRpcError` | Electrum returned a JSON-RPC error | `method`, `code`, `data`, `rpcError`, `response` |

All exported error classes extend `ElectrumError`. HTTP, timeout and response
errors also extend `ElectrumTransportError`. RPC errors preserve the original
error and response fields, with authentication values and top-level wallet
passwords redacted from error diagnostics if the server echoes them.

```js
import { ElectrumRpcError, ElectrumTimeoutError } from 'electrum-wallet-api-node'

try {
  await client.getBalance({ walletPath })
} catch (error) {
  if (error instanceof ElectrumRpcError) {
    // Inspect error.code and error.data using your application's error policy.
  } else if (error instanceof ElectrumTimeoutError) {
    // Check the daemon's state before deciding whether to repeat an operation.
  } else {
    throw error
  }
}
```

Requests have generated UUID IDs and responses must match them. The client does
not follow redirects, retry requests, send batches or serialize independent calls
into a queue. A timeout does not guarantee that Electrum stopped processing a
command. In the inspected daemon, an unregistered method produces HTTP 500;
it need not produce a JSON-RPC method-not-found error.

Constructor and named-parameter validation can throw synchronously. Transport
and RPC failures reject the returned promise.

## TypeScript

Declarations are included. RPC results default to `unknown`; supply a result type
matching your daemon version when helpful:

```ts
const balance = await client.getBalance<{ confirmed: string; unconfirmed?: string }>({ walletPath })
```

Parameters remain open to Electrum-specific and future values. The declarations
provide known camelCase parameter names without imposing wallet or transaction
models or overriding Electrum's validation.

## Security

Keep the RPC listener bound to localhost unless access is protected appropriately.
HTTP Basic Authentication does not encrypt credentials; use a trusted local
connection or HTTPS through a secured gateway for remote access. Native TLS
verification remains enabled.

Store authentication and wallet passwords securely. The library emits no logs,
stores connection credentials privately, and redacts known credentials from
errors. Successful RPC results are left unchanged and can contain secrets,
including those returned by `getSeed()` or private-key commands; protect them in
your application. Server errors can contain other sensitive wallet information.

RPC access can spend funds, export private keys, change wallet state, and stop the
daemon. Review transaction results before broadcasting and check operation state
before retrying a failed or timed-out call.

Repository development uses Yarn 4 zero-installs with a checked-in local cache
and PnP loaders, following `wasabi-api-node`. After cloning, run `yarn test`; no
dependency installation is needed when the pinned Yarn version is available.
For development and verification commands, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)
