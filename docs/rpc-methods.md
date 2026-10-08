# RPC coverage and parameters

Inspected upstream **Electrum 4.8.2**, master revision
[`810d934285fea0310dda47a235a8848c1a6c08e2`](https://github.com/spesmilo/electrum/tree/810d934285fea0310dda47a235a8848c1a6c08e2)
on 2026-10-08. This is a source snapshot, not a claim that every deployed Electrum
version has the same commands.

The pinned source links are the primary reference for RPC parameter signatures
and behavior. Official documentation links may supplement them where they
provide useful explanations.

Sources:

- [`electrum/commands.py`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py): all 119 `@command` registrations on `Commands`.
- [`electrum/daemon.py`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/daemon.py): `CommandsServer` registers those commands in full mode and also registers `ping`, `gui`, and `run_cmdline`.

All **122 commands registered by the inspected Electrum source revision** have
direct named wrappers. No registered core endpoint is excluded.
`dumpPrivKeys()` is included for completeness but upstream
only returns a deprecation message; use `getPrivateKeys()` instead.
`testInjectFeeEtas()` is an upstream diagnostic intended for testing (such as regtest).
Plugin-defined commands depend on installed/enabled plugins and have no fixed core
signature; call them with `request()` using their exact registered RPC names.
Private Python helpers and the `electrum daemon` process launcher are not RPC endpoints.

## Method overview

The categories below cover each of the 122 registered RPCs exactly once;
descriptions reflect the implementation in the pinned official source linked
above. Each linked RPC name points to its function definition in this revision.
The three daemon-specific RPCs are defined in `daemon.py`; the remaining
methods are registered in `commands.py`. This inventory describes the full RPC
server; the minimal server registers only `ping` and `gui`.
See [Parameters and requirements](#parameters-and-requirements) for signatures
and [Older versions](#older-versions) for the additional legacy `history()` wrapper.

### Daemon, version and command discovery

| Node.js method | Electrum RPC | Description |
| --- | --- | --- |
| `getInfo()` | [`getinfo`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L253) | Returns network connection details, blockchain heights, Electrum version and fee estimates. |
| `stop()` | [`stop`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L271) | Stops the Electrum daemon. |
| `version()` | [`version`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L781) | Returns the Electrum version string. |
| `versionInfo()` | [`version_info`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L786) | Returns version and installation details for Electrum, Python, available GUIs and dependencies. |
| `help()` | [`help`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1726) | Returns the sorted names of registered Electrum commands. |
| `ping()` | [`ping`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/daemon.py#L357) | Returns `true` to confirm that the daemon RPC server responds. |
| `gui()` | [`gui`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/daemon.py#L360) | Opens a wallet window, optionally with a payment URI, in an already running GUI that supports multiple windows. |
| `runCmdline()` | [`run_cmdline`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/daemon.py#L377) | Executes a registered command using arguments and options from an Electrum configuration object. |

### Wallet lifecycle, storage and synchronization

| Node.js method | Electrum RPC | Description |
| --- | --- | --- |
| `listWallets()` | [`list_wallets`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L277) | Lists wallets loaded in the daemon with their paths, synchronization status and unlock status. |
| `loadWallet()` | [`load_wallet`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L289) | Loads a wallet into the daemon, upgrading its storage if needed. |
| `closeWallet()` | [`close_wallet`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L300) | Stops and unloads a wallet from the daemon. |
| `create()` | [`create`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L305) | Creates a new wallet file and returns its seed, storage path and creation message. |
| `restore()` | [`restore`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L327) | Creates a wallet file from a seed, master key, addresses or private keys. |
| `password()` | [`password`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L351) | Changes the wallet password and optionally its file encryption, then saves the wallet. |
| `get()` | [`get`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L371) | Returns the value stored under a key in the wallet database. |
| `unlock()` | [`unlock`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L488) | Stores the wallet password in memory for subsequent password-protected commands. |
| `isSynchronized()` | [`is_synchronized`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1645) | Returns whether the wallet is up to date. |
| `waitForSync()` | [`wait_for_sync`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1650) | Waits until the wallet is up to date and returns `true`. |

### Configuration

| Node.js method | Electrum RPC | Description |
| --- | --- | --- |
| `getConfig()` | [`getconfig`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L380) | Returns the current value of a configuration variable. |
| `setConfig()` | [`setconfig`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L424) | Sets a configuration variable, rejecting changes to RPC server settings while the daemon is running. |
| `unsetConfig()` | [`unsetconfig`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L434) | Clears a configuration variable so its default value applies. |
| `listConfig()` | [`listconfig`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L444) | Lists the available configuration variables. |
| `helpConfig()` | [`helpconfig`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L449) | Returns the description of a configuration variable or a message that no description is available. |

### Seeds, keys and addresses

| Node.js method | Electrum RPC | Description |
| --- | --- | --- |
| `makeSeed()` | [`make_seed`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L465) | Generates an Electrum seed phrase without creating a wallet. |
| `getSeed()` | [`getseed`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L850) | Returns the wallet's seed phrase. |
| `getMpk()` | [`getmpk`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L827) | Returns the wallet's master public key. |
| `getMasterPrivate()` | [`getmasterprivate`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L832) | Returns the wallet keystore's master private key. |
| `convertXkey()` | [`convert_xkey`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L837) | Re-encodes an extended public or private key with a different script-type prefix. |
| `getPrivateKeys()` | [`getprivatekeys`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L686) | Exports private keys for one or more wallet addresses. |
| `getPrivateKeyForPath()` | [`getprivatekeyforpath`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L699) | Exports the wallet private key at a derivation path. |
| `dumpPrivKeys()` | [`dumpprivkeys`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L716) | Returns a deprecation message directing callers to export keys with `getprivatekeys`. |
| `importPrivkey()` | [`importprivkey`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L856) | Imports whitespace-separated private keys into a compatible imported wallet and reports the results. |
| `getPubKeys()` | [`getpubkeys`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L729) | Returns the public keys associated with a wallet address. |
| `isMine()` | [`ismine`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L707) | Returns whether an address belongs to the wallet. |
| `validateAddress()` | [`validateaddress`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L721) | Returns whether an address is valid for the current Bitcoin network. |
| `createMultisig()` | [`createmultisig`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L636) | Builds a P2SH multisignature address and its redeem script from public keys and a signature threshold. |
| `listAddresses()` | [`listaddresses`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1218) | Lists wallet addresses with optional filters, balances and labels. |
| `createNewAddress()` | [`createnewaddress`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1359) | Derives a new receiving address beyond the wallet's existing address pool. |
| `getUnusedAddress()` | [`getunusedaddress`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1394) | Returns the first receiving address unused by transactions or payment requests, or `null` if none is available. |
| `changeGapLimit()` | [`changegaplimit`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1364) | Changes a deterministic wallet's gap limit after explicit acknowledgement. |
| `getMinAcceptableGap()` | [`getminacceptablegap`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1383) | Returns the minimum gap limit sufficient to discover all known addresses in a synchronized deterministic wallet. |

### Message signing and encryption

| Node.js method | Electrum RPC | Description |
| --- | --- | --- |
| `signMessage()` | [`signmessage`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L913) | Signs a message with the private key for a wallet address and returns a base64-encoded signature. |
| `verifyMessage()` | [`verifymessage`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L933) | Verifies a base64-encoded message signature against an address and the original message. |
| `encrypt()` | [`encrypt`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1271) | Encrypts a message with a supplied public key. |
| `decrypt()` | [`decrypt`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1285) | Decrypts a message with the wallet private key corresponding to the supplied public key and returns UTF-8 text. |

### Wallet balances, coins and freezing

| Node.js method | Electrum RPC | Description |
| --- | --- | --- |
| `getBalance()` | [`getbalance`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L738) | Returns the confirmed wallet balance and any nonzero unconfirmed, unmatured and Lightning balances. |
| `listUnspent()` | [`listunspent`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L493) | Lists the wallet's unspent transaction outputs with values formatted in BTC. |
| `freeze()` | [`freeze`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L649) | Freezes a wallet address to exclude its funds from normal coin selection. |
| `unfreeze()` | [`unfreeze`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L658) | Removes the frozen state from a wallet address. |
| `freezeUtxo()` | [`freeze_utxo`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L667) | Freezes an individual wallet output to exclude it from normal coin selection. |
| `unfreezeUtxo()` | [`unfreeze_utxo`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L677) | Removes the frozen state from an individual wallet output. |

### Network queries and address notifications

| Node.js method | Electrum RPC | Description |
| --- | --- | --- |
| `getAddressHistory()` | [`getaddresshistory`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L477) | Queries the server for an arbitrary address's transaction history without SPV verification. |
| `getAddressUnspent()` | [`getaddressunspent`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L505) | Queries the server for an arbitrary address's unspent outputs without SPV verification. |
| `getAddressBalance()` | [`getaddressbalance`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L752) | Queries the server for an arbitrary address's confirmed and unconfirmed balances without SPV verification. |
| `getMerkle()` | [`getmerkle`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L766) | Retrieves a transaction's Merkle branch from the server for a specified block height. |
| `getServers()` | [`getservers`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L776) | Returns known Electrum servers that are candidates for connecting. |
| `notify()` | [`notify`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1628) | Starts HTTP POST notifications for address status changes, or stops watching when the callback URL is empty. |

### On-chain transactions and fees

| Node.js method | Electrum RPC | Description |
| --- | --- | --- |
| `serialize()` | [`serialize`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L516) | Builds a serialized transaction from a JSON template and signs inputs for which the template supplies private keys. |
| `deserialize()` | [`deserialize`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L615) | Parses a serialized transaction and returns its JSON representation. |
| `signTransactionWithPrivkey()` | [`signtransaction_with_privkey`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L575) | Signs matching transaction inputs with supplied private keys and returns the serialized transaction. |
| `signTransaction()` | [`signtransaction`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L603) | Signs a transaction with the wallet and returns its serialized form. |
| `payTo()` | [`payto`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L967) | Builds a transaction to one destination, signs it unless requested otherwise and optionally saves it without broadcasting. |
| `payToMany()` | [`paytomany`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L999) | Builds a transaction with multiple destination outputs, signs it unless requested otherwise and optionally saves it without broadcasting. |
| `sweep()` | [`sweep`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L888) | Builds a signed transaction spending outputs controlled by supplied private keys to a destination without broadcasting it. |
| `bumpFee()` | [`bumpfee`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1084) | Builds a higher-fee replacement for an unconfirmed transaction and optionally signs it without broadcasting. |
| `dsCancel()` | [`dscancel`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1110) | Builds an RBF replacement spending an eligible unconfirmed transaction's inputs back to the wallet without broadcasting. |
| `broadcast()` | [`broadcast`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L625) | Broadcasts a transaction to the network and returns its transaction ID. |
| `getTransaction()` | [`gettransaction`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1252) | Retrieves a serialized transaction from the wallet or server and checks that its ID matches the requested ID. |
| `addTransaction()` | [`addtransaction`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1587) | Adds a transaction to wallet history without broadcasting and returns its ID or `false` if it was not added. |
| `removeLocalTx()` | [`removelocaltx`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1698) | Removes a local transaction and its dependent transactions from the wallet. |
| `getTxStatus()` | [`get_tx_status`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1713) | Returns the confirmation count of a transaction in the wallet. |
| `getFeeRate()` | [`getfeerate`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1658) | Returns the configured fee policy and its current fee estimate in satoshis per kilovirtualbyte. |
| `testInjectFeeEtas()` | [`test_inject_fee_etas`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1675) | Injects ETA-based fee estimates into the network object for testing, filling missing longer targets with the default relay fee. |

### History and currency conversion

| Node.js method | Electrum RPC | Description |
| --- | --- | --- |
| `onchainHistory()` | [`onchain_history`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1130) | Returns wallet on-chain transaction history with optional time or height filters, fiat values and input/output details. |
| `onchainCapitalGains()` | [`onchain_capital_gains`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1054) | Returns on-chain capital gains calculated using UTXO pricing, optionally restricted to a year. |
| `lightningHistory()` | [`lightning_history`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1169) | Returns the wallet's Lightning history sorted by timestamp. |
| `convertCurrency()` | [`convert_currency`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L2267) | Converts a currency amount using cached spot quotes from the enabled exchange-rate source. |

### Labels and contacts

| Node.js method | Electrum RPC | Description |
| --- | --- | --- |
| `setLabel()` | [`setlabel`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1176) | Sets a wallet label for an item such as an address or transaction ID. |
| `listContacts()` | [`listcontacts`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1187) | Returns the wallet's stored contacts. |
| `searchContacts()` | [`searchcontacts`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1205) | Returns contacts whose names contain the query, ignoring case. |
| `getOpenAlias()` | [`getopenalias`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1192) | Resolves an address, stored contact or OpenAlias name through the wallet's contact resolver. |

### Payment requests and outgoing invoices

| Node.js method | Electrum RPC | Description |
| --- | --- | --- |
| `addRequest()` | [`add_request`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1400) | Creates and exports a saved incoming on-chain or Lightning payment request, or returns `false` when no receiving address is available. |
| `getRequest()` | [`get_request`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1299) | Returns the exported details of a saved incoming payment request. |
| `getInvoice()` | [`get_invoice`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1310) | Returns the exported details of a saved outgoing payment invoice. |
| `listRequests()` | [`list_requests`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1335) | Lists saved incoming payment requests with optional payment-status filtering. |
| `listInvoices()` | [`list_invoices`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1347) | Lists saved outgoing payment invoices with optional payment-status filtering. |
| `deleteRequest()` | [`delete_request`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1600) | Removes a saved incoming payment request. |
| `deleteInvoice()` | [`delete_invoice`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1608) | Removes a saved outgoing payment invoice. |
| `clearRequests()` | [`clear_requests`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1616) | Removes all saved incoming payment requests. |
| `clearInvoices()` | [`clear_invoices`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1622) | Removes all saved outgoing payment invoices. |

### Lightning payments and hold invoices

| Node.js method | Electrum RPC | Description |
| --- | --- | --- |
| `decodeInvoice()` | [`decode_invoice`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1813) | Decodes a BOLT11 Lightning invoice into a JSON representation. |
| `lnPay()` | [`lnpay`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1823) | Saves and attempts to pay a BOLT11 invoice, returning the payment hash, success status, preimage and attempt log. |
| `addHoldInvoice()` | [`add_hold_invoice`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1428) | Creates a Lightning hold invoice for a supplied payment hash that requires manual settlement. |
| `settleHoldInvoice()` | [`settle_hold_invoice`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1481) | Supplies the preimage for a fully received hold invoice without waiting for its HTLCs to settle. |
| `cancelHoldInvoice()` | [`cancel_hold_invoice`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1505) | Cancels an unsettled hold invoice and waits until its complete multipart payment is no longer pending. |
| `checkHoldInvoice()` | [`check_hold_invoice`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1529) | Returns a hold invoice's status, received amount and available invoice, HTLC-expiry or settlement details. |
| `exportLightningPreimage()` | [`export_lightning_preimage`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1573) | Returns the stored preimage for a Lightning payment hash, or `null` if it is unknown. |
| `enableHtlcSettle()` | [`enable_htlc_settle`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1942) | Toggles the wallet Lightning worker's HTLC settlement flag for regtest diagnostics. |

### Lightning peers, routing and onion messages

| Node.js method | Electrum RPC | Description |
| --- | --- | --- |
| `nodeId()` | [`nodeid`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1878) | Returns the wallet's Lightning node public key with its configured listening address appended when present. |
| `addPeer()` | [`add_peer`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1733) | Connects the wallet or gossip worker to a Lightning peer and waits for initialization. |
| `listPeers()` | [`list_peers`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1773) | Lists the wallet or gossip worker's Lightning peers with connection, feature and channel details. |
| `gossipInfo()` | [`gossip_info`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1751) | Returns Lightning gossip reception, channel database and forwarding statistics. |
| `clearLnBlacklist()` | [`clear_ln_blacklist`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1951) | Clears the Lightning path finder's blacklist if a path finder exists. |
| `resetLiquidityHints()` | [`reset_liquidity_hints`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1956) | Resets Lightning routing liquidity hints and clears the path finder's blacklist if a path finder exists. |
| `sendOnionMessage()` | [`send_onion_message`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L2309) | Attempts to send a text onion message to a node or blinded path and reports whether sending raised an error. |
| `getBlindedPathVia()` | [`get_blinded_path_via`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L2340) | Creates a serialized blinded path to the wallet's node through a directly connected introduction peer. |

### Lightning channels and backups

| Node.js method | Electrum RPC | Description |
| --- | --- | --- |
| `openChannel()` | [`open_channel`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1789) | Opens a funded Lightning channel with a peer and returns the funding outpoint. |
| `listChannels()` | [`list_channels`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1884) | Lists wallet Lightning channels with optional filters and their states, balances and commitment numbers. |
| `closeChannel()` | [`close_channel`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1962) | Closes a Lightning channel cooperatively or forcibly and returns the closing transaction ID. |
| `deleteChannel()` | [`delete_channel`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1978) | Removes a Lightning channel from the wallet only when its state permits deletion. |
| `requestForceClose()` | [`request_force_close`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L2014) | Asks the remote peer to force-close a channel known to the wallet or its backups. |
| `getChannelCtx()` | [`get_channel_ctx`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L2050) | Returns the serialized local force-close commitment transaction after explicit acknowledgement, without broadcasting it. |
| `listChannelHtlcs()` | [`list_channel_htlcs`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L2070) | Lists a channel's settled, inflight and failed HTLCs with direction, amount, timestamp and payment hash. |
| `getWatchtowerCtn()` | [`get_watchtower_ctn`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L2100) | Returns the local watchtower's commitment transaction number for a channel as a regtest diagnostic. |
| `rebalanceChannels()` | [`rebalance_channels`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L2109) | Attempts to move Lightning liquidity between two wallet channels and returns success status and an attempt log. |
| `listChannelBackups()` | [`list_channel_backups`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1927) | Lists the wallet's Lightning channel backups with their identifiers and states. |
| `exportChannelBackup()` | [`export_channel_backup`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L2030) | Returns an encrypted static backup of a wallet Lightning channel. |
| `importChannelBackup()` | [`import_channel_backup`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L2043) | Imports an encrypted Lightning channel backup into the wallet. |
| `deleteChannelBackup()` | [`delete_channel_backup`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1996) | Removes a Lightning channel backup from the wallet only when it is eligible for deletion. |

### Submarine swaps

| Node.js method | Electrum RPC | Description |
| --- | --- | --- |
| `getSubmarineSwapProviders()` | [`get_submarine_swap_providers`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L2136) | Queries Nostr relays for submarine swap providers and returns their advertised fees and amount limits. |
| `normalSwap()` | [`normal_swap`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L2162) | Exchanges on-chain BTC for Lightning BTC through the configured provider, or calculates amounts for a dry run. |
| `reverseSwap()` | [`reverse_swap`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L2210) | Exchanges Lightning BTC for on-chain BTC through the configured provider, or calculates amounts and prepayment for a dry run. |

## Parameters and requirements

All Node.js RPC methods listed below follow
`client.method(params = {}, options = {})`. The first object contains only
Electrum named arguments. The optional second object supports only local
`timeout` (milliseconds) and `signal` (standard `AbortSignal`) configuration;
it is never sent to Electrum. Existing one-object calls remain supported.
Parameter order does not matter. JavaScript parameter names use camelCase where
appropriate and are automatically mapped to
their Electrum RPC equivalents.

For example:

```js
await client.payTo({
  destination: 'bc1...',
  amount: '0.01',
  feeRate: '2.5',
  walletPath: '/path/to/wallet'
})
```

This maps to Electrum's [`payto`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L967)
RPC with named parameters `destination`, `amount`, `feerate`, and `wallet_path`.

Optional parameters may be omitted. Required parameters depend on the individual
Electrum RPC method. The generic
`client.request(method, params = {}, options = {})` also supports positional
parameter arrays, but named objects are recommended. Generic requests
use Electrum's original parameter names without camelCase mapping.

Omitting `options.timeout` uses the timeout configured in the client constructor.
A per-call timeout overrides it without changing the default. Both cover waiting
for response headers and reading the complete body. An already aborted signal
prevents sending the request. When timeout and cancellation are both enabled,
the first event wins: local timeout rejects with `ElectrumTimeoutError`, caller
cancellation with `ElectrumTransportError` and a sanitized abort cause.

Electrum's own `timeout` arguments (for example, on `lnPay()` and `addPeer()`)
remain RPC parameters in the first object, with Electrum's units and behavior.
The timeout in the second object is always the client's waiting time in
milliseconds. Unknown local option keys are rejected.

A timeout or cancellation only stops the client from waiting for the response;
it does not guarantee Electrum has stopped executing the command. This matters
for `broadcast()`, `payTo()`, and wallet modifications. The client never retries
automatically. See [Calling methods and parameters](../README.md#calling-methods-and-parameters)
for examples.

The table lists JavaScript parameter names in upstream signature order. A `*`
marks an upstream required parameter. All unmarked parameters are optional.

| JavaScript method | Electrum RPC | Named parameters | Requirements |
| --- | --- | --- | --- |
| `getInfo()` | [`getinfo`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L253) | None | network |
| `stop()` | [`stop`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L271) | None | network |
| `listWallets()` | [`list_wallets`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L277) | None | network |
| `loadWallet()` | [`load_wallet`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L289) | `walletPath`, `password` | network |
| `closeWallet()` | [`close_wallet`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L300) | `walletPath` | network |
| `create()` | [`create`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L305) | `passphrase`, `password`, `encryptFile`, `seedType`, `walletPath` | None |
| `restore()` | [`restore`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L327) | `text*`, `passphrase`, `password`, `encryptFile`, `walletPath` | None |
| `password()` | [`password`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L351) | `password`, `newPassword`, `encryptFile`, `walletPath` | loaded wallet, wallet password if encrypted |
| `get()` | [`get`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L371) | `key*`, `walletPath` | loaded wallet |
| `getConfig()` | [`getconfig`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L380) | `key*` | None |
| `setConfig()` | [`setconfig`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L424) | `key*`, `value*` | None |
| `unsetConfig()` | [`unsetconfig`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L434) | `key*` | None |
| `listConfig()` | [`listconfig`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L444) | None | None |
| `helpConfig()` | [`helpconfig`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L449) | `key*` | None |
| `makeSeed()` | [`make_seed`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L465) | `nbits`, `language`, `seedType` | None |
| `getAddressHistory()` | [`getaddresshistory`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L477) | `address*` | network |
| `unlock()` | [`unlock`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L488) | `walletPath`, `password` | loaded wallet, wallet password if encrypted |
| `listUnspent()` | [`listunspent`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L493) | `walletPath` | loaded wallet |
| `getAddressUnspent()` | [`getaddressunspent`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L505) | `address*` | network |
| `serialize()` | [`serialize`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L516) | `jsonTx*` | None |
| `signTransactionWithPrivkey()` | [`signtransaction_with_privkey`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L575) | `tx*`, `privkey*` | None |
| `signTransaction()` | [`signtransaction`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L603) | `tx*`, `password`, `walletPath`, `ignoreWarnings` | loaded wallet, wallet password if encrypted |
| `deserialize()` | [`deserialize`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L615) | `tx*` | None |
| `broadcast()` | [`broadcast`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L625) | `tx*` | network |
| `createMultisig()` | [`createmultisig`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L636) | `num*`, `pubkeys*` | None |
| `freeze()` | [`freeze`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L649) | `address*`, `walletPath` | loaded wallet |
| `unfreeze()` | [`unfreeze`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L658) | `address*`, `walletPath` | loaded wallet |
| `freezeUtxo()` | [`freeze_utxo`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L667) | `coin*`, `walletPath` | loaded wallet |
| `unfreezeUtxo()` | [`unfreeze_utxo`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L677) | `coin*`, `walletPath` | loaded wallet |
| `getPrivateKeys()` | [`getprivatekeys`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L686) | `address*`, `password`, `walletPath` | loaded wallet, wallet password if encrypted |
| `getPrivateKeyForPath()` | [`getprivatekeyforpath`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L699) | `path*`, `password`, `walletPath` | loaded wallet, wallet password if encrypted |
| `isMine()` | [`ismine`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L707) | `address*`, `walletPath` | loaded wallet |
| `dumpPrivKeys()` | [`dumpprivkeys`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L716) | None | None |
| `validateAddress()` | [`validateaddress`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L721) | `address*` | None |
| `getPubKeys()` | [`getpubkeys`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L729) | `address*`, `walletPath` | loaded wallet |
| `getBalance()` | [`getbalance`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L738) | `walletPath` | loaded wallet |
| `getAddressBalance()` | [`getaddressbalance`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L752) | `address*` | network |
| `getMerkle()` | [`getmerkle`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L766) | `txid*`, `height*` | network |
| `getServers()` | [`getservers`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L776) | None | network |
| `version()` | [`version`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L781) | None | None |
| `versionInfo()` | [`version_info`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L786) | None | None |
| `getMpk()` | [`getmpk`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L827) | `walletPath` | loaded wallet |
| `getMasterPrivate()` | [`getmasterprivate`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L832) | `password`, `walletPath` | loaded wallet, wallet password if encrypted |
| `convertXkey()` | [`convert_xkey`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L837) | `xkey*`, `xtype*` | None |
| `getSeed()` | [`getseed`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L850) | `password`, `walletPath` | loaded wallet, wallet password if encrypted |
| `importPrivkey()` | [`importprivkey`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L856) | `privkey*`, `password`, `walletPath` | loaded wallet, wallet password if encrypted |
| `sweep()` | [`sweep`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L888) | `privkey*`, `destination*`, `fee`, `feeRate`, `imax` | network |
| `signMessage()` | [`signmessage`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L913) | `address*`, `message*`, `password`, `walletPath` | loaded wallet, wallet password if encrypted |
| `verifyMessage()` | [`verifymessage`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L933) | `address*`, `signature*`, `message*` | None |
| `payTo()` | [`payto`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L967) | `destination*`, `amount*`, `fee`, `feeRate`, `fromAddr`, `fromCoins`, `changeAddr`, `unsigned`, `rbf`, `password`, `locktime`, `addTransaction`, `walletPath` | loaded wallet, wallet password if encrypted |
| `payToMany()` | [`paytomany`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L999) | `outputs*`, `fee`, `feeRate`, `fromAddr`, `fromCoins`, `changeAddr`, `unsigned`, `rbf`, `password`, `locktime`, `addTransaction`, `walletPath` | loaded wallet, wallet password if encrypted |
| `onchainCapitalGains()` | [`onchain_capital_gains`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1054) | `year`, `walletPath` | loaded wallet |
| `bumpFee()` | [`bumpfee`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1084) | `tx*`, `newFeeRate*`, `fromCoins`, `decreasePayment`, `password`, `unsigned`, `walletPath` | loaded wallet, wallet password if encrypted |
| `dsCancel()` | [`dscancel`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1110) | `tx*`, `newFeeRate*`, `password`, `unsigned`, `walletPath` | loaded wallet, wallet password if encrypted |
| `onchainHistory()` | [`onchain_history`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1130) | `showFiat`, `year`, `showAddresses`, `fromHeight`, `toHeight`, `walletPath` | loaded wallet |
| `lightningHistory()` | [`lightning_history`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1169) | `walletPath` | loaded wallet, Lightning wallet |
| `setLabel()` | [`setlabel`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1176) | `key*`, `label*`, `walletPath` | loaded wallet |
| `listContacts()` | [`listcontacts`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1187) | `walletPath` | loaded wallet |
| `getOpenAlias()` | [`getopenalias`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1192) | `key*`, `walletPath` | loaded wallet |
| `searchContacts()` | [`searchcontacts`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1205) | `query*`, `walletPath` | loaded wallet |
| `listAddresses()` | [`listaddresses`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1218) | `receiving`, `change`, `labels`, `frozen`, `unused`, `funded`, `balance`, `walletPath` | loaded wallet |
| `getTransaction()` | [`gettransaction`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1252) | `txid*`, `walletPath` | network |
| `encrypt()` | [`encrypt`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1271) | `pubkey*`, `message*` | None |
| `decrypt()` | [`decrypt`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1285) | `pubkey*`, `encrypted*`, `password`, `walletPath` | loaded wallet, wallet password if encrypted |
| `getRequest()` | [`get_request`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1299) | `requestId*`, `walletPath` | loaded wallet |
| `getInvoice()` | [`get_invoice`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1310) | `invoiceId*`, `walletPath` | loaded wallet |
| `listRequests()` | [`list_requests`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1335) | `pending`, `expired`, `paid`, `walletPath` | loaded wallet |
| `listInvoices()` | [`list_invoices`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1347) | `pending`, `expired`, `paid`, `walletPath` | loaded wallet |
| `createNewAddress()` | [`createnewaddress`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1359) | `walletPath` | loaded wallet |
| `changeGapLimit()` | [`changegaplimit`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1364) | `newLimit*`, `iKnowWhatImDoing`, `walletPath` | loaded wallet |
| `getMinAcceptableGap()` | [`getminacceptablegap`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1383) | `walletPath` | network, loaded wallet |
| `getUnusedAddress()` | [`getunusedaddress`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1394) | `walletPath` | loaded wallet |
| `addRequest()` | [`add_request`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1400) | `amount*`, `memo`, `expiry`, `lightning`, `force`, `walletPath` | loaded wallet |
| `addHoldInvoice()` | [`add_hold_invoice`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1428) | `paymentHash*`, `amount`, `memo`, `expiry`, `minFinalCltvExpiryDelta`, `walletPath` | network, loaded wallet, Lightning wallet |
| `settleHoldInvoice()` | [`settle_hold_invoice`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1481) | `preimage*`, `walletPath` | network, loaded wallet, Lightning wallet |
| `cancelHoldInvoice()` | [`cancel_hold_invoice`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1505) | `paymentHash*`, `walletPath` | network, loaded wallet, Lightning wallet |
| `checkHoldInvoice()` | [`check_hold_invoice`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1529) | `paymentHash*`, `walletPath` | network, loaded wallet, Lightning wallet |
| `exportLightningPreimage()` | [`export_lightning_preimage`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1573) | `paymentHash*`, `walletPath` | loaded wallet, Lightning wallet |
| `addTransaction()` | [`addtransaction`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1587) | `tx*`, `walletPath` | loaded wallet |
| `deleteRequest()` | [`delete_request`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1600) | `requestId*`, `walletPath` | loaded wallet |
| `deleteInvoice()` | [`delete_invoice`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1608) | `invoiceId*`, `walletPath` | loaded wallet |
| `clearRequests()` | [`clear_requests`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1616) | `walletPath` | loaded wallet |
| `clearInvoices()` | [`clear_invoices`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1622) | `walletPath` | loaded wallet |
| `notify()` | [`notify`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1628) | `address*`, `url*` | network |
| `isSynchronized()` | [`is_synchronized`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1645) | `walletPath` | network, loaded wallet |
| `waitForSync()` | [`wait_for_sync`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1650) | `walletPath` | network, loaded wallet |
| `getFeeRate()` | [`getfeerate`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1658) | None | network |
| `testInjectFeeEtas()` | [`test_inject_fee_etas`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1675) | `feeEst*` | network |
| `removeLocalTx()` | [`removelocaltx`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1698) | `txid*`, `walletPath` | loaded wallet |
| `getTxStatus()` | [`get_tx_status`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1713) | `txid*`, `walletPath` | network, loaded wallet |
| `help()` | [`help`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1726) | None | None |
| `addPeer()` | [`add_peer`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1733) | `connectionString*`, `timeout`, `gossip`, `walletPath` | network, loaded wallet, Lightning wallet |
| `gossipInfo()` | [`gossip_info`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1751) | `walletPath` | network, loaded wallet, Lightning wallet |
| `listPeers()` | [`list_peers`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1773) | `gossip`, `walletPath` | network, loaded wallet, Lightning wallet |
| `openChannel()` | [`open_channel`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1789) | `connectionString*`, `amount*`, `pushAmount`, `public`, `zeroconf`, `password`, `walletPath` | network, loaded wallet, wallet password if encrypted, Lightning wallet |
| `decodeInvoice()` | [`decode_invoice`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1813) | `invoice*` | None |
| `lnPay()` | [`lnpay`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1823) | `invoice*`, `timeout`, `maxCltv`, `maxFeeMsat`, `password`, `walletPath` | network, loaded wallet, wallet password if encrypted, Lightning wallet |
| `nodeId()` | [`nodeid`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1878) | `walletPath` | loaded wallet, Lightning wallet |
| `listChannels()` | [`list_channels`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1884) | `public`, `private`, `active`, `open`, `walletPath` | loaded wallet, Lightning wallet |
| `listChannelBackups()` | [`list_channel_backups`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1927) | `walletPath` | loaded wallet, Lightning wallet |
| `enableHtlcSettle()` | [`enable_htlc_settle`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1942) | `b*`, `walletPath` | network, loaded wallet, Lightning wallet |
| `clearLnBlacklist()` | [`clear_ln_blacklist`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1951) | None | network |
| `resetLiquidityHints()` | [`reset_liquidity_hints`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1956) | None | network |
| `closeChannel()` | [`close_channel`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1962) | `channelPoint*`, `force`, `password`, `walletPath` | network, loaded wallet, wallet password if encrypted, Lightning wallet |
| `deleteChannel()` | [`delete_channel`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1978) | `channelPoint*`, `password`, `walletPath` | loaded wallet, wallet password if encrypted, Lightning wallet |
| `deleteChannelBackup()` | [`delete_channel_backup`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L1996) | `channelPoint*`, `password`, `walletPath` | loaded wallet, wallet password if encrypted, Lightning wallet |
| `requestForceClose()` | [`request_force_close`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L2014) | `channelPoint*`, `connectionString`, `password`, `walletPath` | network, loaded wallet, wallet password if encrypted, Lightning wallet |
| `exportChannelBackup()` | [`export_channel_backup`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L2030) | `channelPoint*`, `password`, `walletPath` | loaded wallet, wallet password if encrypted, Lightning wallet |
| `importChannelBackup()` | [`import_channel_backup`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L2043) | `encrypted*`, `walletPath` | loaded wallet, Lightning wallet |
| `getChannelCtx()` | [`get_channel_ctx`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L2050) | `channelPoint*`, `password`, `iKnowWhatImDoing`, `walletPath` | network, loaded wallet, wallet password if encrypted, Lightning wallet |
| `listChannelHtlcs()` | [`list_channel_htlcs`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L2070) | `channelPoint*`, `password`, `walletPath` | network, loaded wallet, Lightning wallet |
| `getWatchtowerCtn()` | [`get_watchtower_ctn`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L2100) | `channelPoint*`, `walletPath` | network, loaded wallet, Lightning wallet |
| `rebalanceChannels()` | [`rebalance_channels`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L2109) | `fromScid*`, `destScid*`, `amount*`, `password`, `walletPath` | network, loaded wallet, wallet password if encrypted, Lightning wallet |
| `getSubmarineSwapProviders()` | [`get_submarine_swap_providers`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L2136) | `queryTime`, `walletPath` | network, loaded wallet, Lightning wallet |
| `normalSwap()` | [`normal_swap`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L2162) | `onchainAmount*`, `lightningAmount*`, `password`, `walletPath` | network, loaded wallet, wallet password if encrypted, Lightning wallet |
| `reverseSwap()` | [`reverse_swap`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L2210) | `lightningAmount*`, `onchainAmount*`, `prepayment`, `password`, `walletPath` | network, loaded wallet, wallet password if encrypted, Lightning wallet |
| `convertCurrency()` | [`convert_currency`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L2267) | `fromAmount`, `fromCcy`, `toCcy` | network |
| `sendOnionMessage()` | [`send_onion_message`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L2309) | `nodeIdOrBlindedPathHex*`, `message*`, `walletPath` | network, loaded wallet, Lightning wallet |
| `getBlindedPathVia()` | [`get_blinded_path_via`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py#L2340) | `nodeId*`, `dummyHops`, `walletPath` | network, loaded wallet, Lightning wallet |
| `ping()` | [`ping`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/daemon.py#L357) | None | None |
| `gui()` | [`gui`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/daemon.py#L360) | `configOptions*` | None |
| `runCmdline()` | [`run_cmdline`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/daemon.py#L377) | `configOptions*` | None |

Original RPC parameter names are also accepted by the named methods. Unknown keys
are forwarded unchanged. Do not provide both spellings of the same parameter.
Only top-level parameter names are mapped: nested JSON values keep their keys.
Required arguments, values, defaults and version-specific behavior are validated
by Electrum. The client never injects command defaults.

`walletPath` maps to `wallet_path`. For wallet commands, the Python decorator
resolves this path to the internal `wallet` object; a JSON wallet model is not
required. Paths refer to the daemon's filesystem. If omitted, Electrum chooses
its configured default path and may report that the wallet is not loaded.

## Parameter aliases

Original upstream spelling is always accepted. These aliases apply only to
methods whose signatures contain the corresponding parameter:

| JavaScript | Electrum |
| --- | --- |
| `addTransaction` | `addtransaction` |
| `changeAddr` | `change_addr` |
| `channelPoint` | `channel_point` |
| `configOptions` | `config_options` |
| `connectionString` | `connection_string` |
| `decreasePayment` | `decrease_payment` |
| `destScid` | `dest_scid` |
| `dummyHops` | `dummy_hops` |
| `encryptFile` | `encrypt_file` |
| `feeEst` | `fee_est` |
| `feeRate` | `feerate` |
| `fromAddr` | `from_addr` |
| `fromAmount` | `from_amount` |
| `fromCcy` | `from_ccy` |
| `fromCoins` | `from_coins` |
| `fromHeight` | `from_height` |
| `fromScid` | `from_scid` |
| `iKnowWhatImDoing` | `iknowwhatimdoing` |
| `ignoreWarnings` | `ignore_warnings` |
| `invoiceId` | `invoice_id` |
| `jsonTx` | `jsontx` |
| `lightningAmount` | `lightning_amount` |
| `maxCltv` | `max_cltv` |
| `maxFeeMsat` | `max_fee_msat` |
| `minFinalCltvExpiryDelta` | `min_final_cltv_expiry_delta` |
| `newFeeRate` | `new_fee_rate` |
| `newLimit` | `new_limit` |
| `newPassword` | `new_password` |
| `nodeId` | `node_id` |
| `nodeIdOrBlindedPathHex` | `node_id_or_blinded_path_hex` |
| `onchainAmount` | `onchain_amount` |
| `paymentHash` | `payment_hash` |
| `pushAmount` | `push_amount` |
| `queryTime` | `query_time` |
| `requestId` | `request_id` |
| `seedType` | `seed_type` |
| `showAddresses` | `show_addresses` |
| `showFiat` | `show_fiat` |
| `toCcy` | `to_ccy` |
| `toHeight` | `to_height` |
| `url` | `URL` |
| `walletPath` | `wallet_path` |

For `gui()` and `runCmdline()`, `configOptions` maps to `config_options`. Its
nested fields must use Electrum's original configuration/command keys, such as
`wallet_path` and `cmd`; the client does not rewrite them.

## Older versions

| Node.js method | Electrum RPC | Description |
| --- | --- | --- |
| `history()` | `history` | Calls the legacy wallet-history RPC on older Electrum versions that register it. |

An additional `history(params = {}, options = {})` wrapper calls the legacy RPC name `history`
directly, with aliases for `walletPath`, `showAddresses`, and `showFiat`.
It is absent from this source snapshot, so it has no definition link at the pinned
revision. Newer versions expose `onchainHistory()`
and `lightningHistory()`; the wrapper does not detect versions or substitute
commands. A call unsupported by the running daemon fails as Electrum specifies.

Use `version()`, `help()`, and `request()` to work with commands provided by your
particular daemon version. An unregistered method currently produces an HTTP
500 response in `AuthenticatedServer.handle`, rather than a JSON-RPC
method-not-found error.

## Updating coverage

`test/fixtures/electrum-rpc.json` records core command names, external parameter
signatures, Python defaults, requirement flags and source lines from the inspected
revision. Tests check every endpoint against that independent source snapshot,
including every camelCase alias. When updating Electrum support:

1. Pin and inspect both official source files again, including command bodies and
   delegated helpers when their behavior is unclear; method names and docstrings
   alone are not sufficient authority for descriptions.
2. Update the source snapshot, wrappers and declarations to reflect added,
   removed or changed registrations and signatures.
3. Update the revision, version, inspection date and source links in this document,
   and regenerate RPC definition links from the new source files, verifying each
   function name at its `#L<number>` anchor (including methods in `daemon.py`).
   Derive the registered-command count from the snapshot rather than treating
   122 as a permanent Electrum total.
4. Keep exactly one overview row and one parameter row per snapshot command,
   with the same Node.js/RPC pair; keep legacy wrappers outside that inventory.
   Update behavior descriptions, parameter aliases and requirements when upstream
   changes them, and update the README coverage statement.
5. Run `yarn test` and compare the overview and parameter inventories with
   `test/fixtures/electrum-rpc.json` to catch missing or duplicate rows.
