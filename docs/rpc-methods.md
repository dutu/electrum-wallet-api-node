# RPC coverage and parameters

Inspected upstream **Electrum 4.8.2**, master revision
[`810d934285fea0310dda47a235a8848c1a6c08e2`](https://github.com/spesmilo/electrum/tree/810d934285fea0310dda47a235a8848c1a6c08e2)
on 2026-10-08. This is a source snapshot, not a claim that every deployed Electrum
version has the same commands.

Sources:

- [`electrum/commands.py`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/commands.py): all 119 `@command` registrations on `Commands`.
- [`electrum/daemon.py`](https://github.com/spesmilo/electrum/blob/810d934285fea0310dda47a235a8848c1a6c08e2/electrum/daemon.py): `CommandsServer` registers those commands in full mode and also registers `ping`, `gui`, and `run_cmdline`.

All **122 core RPC endpoints** have direct named wrappers. No registered core
endpoint is excluded. `dumpPrivKeys()` is included for completeness but upstream
only returns a deprecation message; use `getPrivateKeys()` instead.
`testInjectFeeEtas()` is an upstream diagnostic intended for testing (such as regtest).
Plugin-defined commands depend on installed/enabled plugins and have no fixed core
signature; call them with `request()` using their exact registered RPC names.
Private Python helpers and the `electrum daemon` process launcher are not RPC endpoints.

Named methods take one parameter object. CamelCase aliases shown below map to the
corresponding upstream names; original RPC names are also accepted. Unknown keys
are forwarded unchanged. Do not provide both spellings of the same parameter.
Only top-level parameter names are mapped: nested JSON values keep their keys.
Required arguments, values, defaults and version-specific behavior are validated
by Electrum. The client never injects command defaults.

`walletPath` maps to `wallet_path`. For wallet commands, the Python decorator
resolves this path to the internal `wallet` object; a JSON wallet model is not
required. Paths refer to the daemon's filesystem. If omitted, Electrum chooses
its configured default path and may report that the wallet is not loaded.

The table lists JavaScript parameter names in upstream signature order. A `*`
marks an upstream required parameter. All unmarked parameters are optional.

| JavaScript method | Electrum RPC | Named parameters | Requirements |
| --- | --- | --- | --- |
| `getInfo()` | `getinfo` | None | network |
| `stop()` | `stop` | None | network |
| `listWallets()` | `list_wallets` | None | network |
| `loadWallet()` | `load_wallet` | `walletPath`, `password` | network |
| `closeWallet()` | `close_wallet` | `walletPath` | network |
| `create()` | `create` | `passphrase`, `password`, `encryptFile`, `seedType`, `walletPath` | None |
| `restore()` | `restore` | `text*`, `passphrase`, `password`, `encryptFile`, `walletPath` | None |
| `password()` | `password` | `password`, `newPassword`, `encryptFile`, `walletPath` | loaded wallet, wallet password if encrypted |
| `get()` | `get` | `key*`, `walletPath` | loaded wallet |
| `getConfig()` | `getconfig` | `key*` | None |
| `setConfig()` | `setconfig` | `key*`, `value*` | None |
| `unsetConfig()` | `unsetconfig` | `key*` | None |
| `listConfig()` | `listconfig` | None | None |
| `helpConfig()` | `helpconfig` | `key*` | None |
| `makeSeed()` | `make_seed` | `nbits`, `language`, `seedType` | None |
| `getAddressHistory()` | `getaddresshistory` | `address*` | network |
| `unlock()` | `unlock` | `walletPath`, `password` | loaded wallet, wallet password if encrypted |
| `listUnspent()` | `listunspent` | `walletPath` | loaded wallet |
| `getAddressUnspent()` | `getaddressunspent` | `address*` | network |
| `serialize()` | `serialize` | `jsonTx*` | None |
| `signTransactionWithPrivkey()` | `signtransaction_with_privkey` | `tx*`, `privkey*` | None |
| `signTransaction()` | `signtransaction` | `tx*`, `password`, `walletPath`, `ignoreWarnings` | loaded wallet, wallet password if encrypted |
| `deserialize()` | `deserialize` | `tx*` | None |
| `broadcast()` | `broadcast` | `tx*` | network |
| `createMultisig()` | `createmultisig` | `num*`, `pubkeys*` | None |
| `freeze()` | `freeze` | `address*`, `walletPath` | loaded wallet |
| `unfreeze()` | `unfreeze` | `address*`, `walletPath` | loaded wallet |
| `freezeUtxo()` | `freeze_utxo` | `coin*`, `walletPath` | loaded wallet |
| `unfreezeUtxo()` | `unfreeze_utxo` | `coin*`, `walletPath` | loaded wallet |
| `getPrivateKeys()` | `getprivatekeys` | `address*`, `password`, `walletPath` | loaded wallet, wallet password if encrypted |
| `getPrivateKeyForPath()` | `getprivatekeyforpath` | `path*`, `password`, `walletPath` | loaded wallet, wallet password if encrypted |
| `isMine()` | `ismine` | `address*`, `walletPath` | loaded wallet |
| `dumpPrivKeys()` | `dumpprivkeys` | None | None |
| `validateAddress()` | `validateaddress` | `address*` | None |
| `getPubKeys()` | `getpubkeys` | `address*`, `walletPath` | loaded wallet |
| `getBalance()` | `getbalance` | `walletPath` | loaded wallet |
| `getAddressBalance()` | `getaddressbalance` | `address*` | network |
| `getMerkle()` | `getmerkle` | `txid*`, `height*` | network |
| `getServers()` | `getservers` | None | network |
| `version()` | `version` | None | None |
| `versionInfo()` | `version_info` | None | None |
| `getMpk()` | `getmpk` | `walletPath` | loaded wallet |
| `getMasterPrivate()` | `getmasterprivate` | `password`, `walletPath` | loaded wallet, wallet password if encrypted |
| `convertXkey()` | `convert_xkey` | `xkey*`, `xtype*` | None |
| `getSeed()` | `getseed` | `password`, `walletPath` | loaded wallet, wallet password if encrypted |
| `importPrivkey()` | `importprivkey` | `privkey*`, `password`, `walletPath` | loaded wallet, wallet password if encrypted |
| `sweep()` | `sweep` | `privkey*`, `destination*`, `fee`, `feeRate`, `imax` | network |
| `signMessage()` | `signmessage` | `address*`, `message*`, `password`, `walletPath` | loaded wallet, wallet password if encrypted |
| `verifyMessage()` | `verifymessage` | `address*`, `signature*`, `message*` | None |
| `payTo()` | `payto` | `destination*`, `amount*`, `fee`, `feeRate`, `fromAddr`, `fromCoins`, `changeAddr`, `unsigned`, `rbf`, `password`, `locktime`, `addTransaction`, `walletPath` | loaded wallet, wallet password if encrypted |
| `payToMany()` | `paytomany` | `outputs*`, `fee`, `feeRate`, `fromAddr`, `fromCoins`, `changeAddr`, `unsigned`, `rbf`, `password`, `locktime`, `addTransaction`, `walletPath` | loaded wallet, wallet password if encrypted |
| `onchainCapitalGains()` | `onchain_capital_gains` | `year`, `walletPath` | loaded wallet |
| `bumpFee()` | `bumpfee` | `tx*`, `newFeeRate*`, `fromCoins`, `decreasePayment`, `password`, `unsigned`, `walletPath` | loaded wallet, wallet password if encrypted |
| `dsCancel()` | `dscancel` | `tx*`, `newFeeRate*`, `password`, `unsigned`, `walletPath` | loaded wallet, wallet password if encrypted |
| `onchainHistory()` | `onchain_history` | `showFiat`, `year`, `showAddresses`, `fromHeight`, `toHeight`, `walletPath` | loaded wallet |
| `lightningHistory()` | `lightning_history` | `walletPath` | loaded wallet, Lightning wallet |
| `setLabel()` | `setlabel` | `key*`, `label*`, `walletPath` | loaded wallet |
| `listContacts()` | `listcontacts` | `walletPath` | loaded wallet |
| `getOpenAlias()` | `getopenalias` | `key*`, `walletPath` | loaded wallet |
| `searchContacts()` | `searchcontacts` | `query*`, `walletPath` | loaded wallet |
| `listAddresses()` | `listaddresses` | `receiving`, `change`, `labels`, `frozen`, `unused`, `funded`, `balance`, `walletPath` | loaded wallet |
| `getTransaction()` | `gettransaction` | `txid*`, `walletPath` | network |
| `encrypt()` | `encrypt` | `pubkey*`, `message*` | None |
| `decrypt()` | `decrypt` | `pubkey*`, `encrypted*`, `password`, `walletPath` | loaded wallet, wallet password if encrypted |
| `getRequest()` | `get_request` | `requestId*`, `walletPath` | loaded wallet |
| `getInvoice()` | `get_invoice` | `invoiceId*`, `walletPath` | loaded wallet |
| `listRequests()` | `list_requests` | `pending`, `expired`, `paid`, `walletPath` | loaded wallet |
| `listInvoices()` | `list_invoices` | `pending`, `expired`, `paid`, `walletPath` | loaded wallet |
| `createNewAddress()` | `createnewaddress` | `walletPath` | loaded wallet |
| `changeGapLimit()` | `changegaplimit` | `newLimit*`, `iKnowWhatImDoing`, `walletPath` | loaded wallet |
| `getMinAcceptableGap()` | `getminacceptablegap` | `walletPath` | network, loaded wallet |
| `getUnusedAddress()` | `getunusedaddress` | `walletPath` | loaded wallet |
| `addRequest()` | `add_request` | `amount*`, `memo`, `expiry`, `lightning`, `force`, `walletPath` | loaded wallet |
| `addHoldInvoice()` | `add_hold_invoice` | `paymentHash*`, `amount`, `memo`, `expiry`, `minFinalCltvExpiryDelta`, `walletPath` | network, loaded wallet, Lightning wallet |
| `settleHoldInvoice()` | `settle_hold_invoice` | `preimage*`, `walletPath` | network, loaded wallet, Lightning wallet |
| `cancelHoldInvoice()` | `cancel_hold_invoice` | `paymentHash*`, `walletPath` | network, loaded wallet, Lightning wallet |
| `checkHoldInvoice()` | `check_hold_invoice` | `paymentHash*`, `walletPath` | network, loaded wallet, Lightning wallet |
| `exportLightningPreimage()` | `export_lightning_preimage` | `paymentHash*`, `walletPath` | loaded wallet, Lightning wallet |
| `addTransaction()` | `addtransaction` | `tx*`, `walletPath` | loaded wallet |
| `deleteRequest()` | `delete_request` | `requestId*`, `walletPath` | loaded wallet |
| `deleteInvoice()` | `delete_invoice` | `invoiceId*`, `walletPath` | loaded wallet |
| `clearRequests()` | `clear_requests` | `walletPath` | loaded wallet |
| `clearInvoices()` | `clear_invoices` | `walletPath` | loaded wallet |
| `notify()` | `notify` | `address*`, `url*` | network |
| `isSynchronized()` | `is_synchronized` | `walletPath` | network, loaded wallet |
| `waitForSync()` | `wait_for_sync` | `walletPath` | network, loaded wallet |
| `getFeeRate()` | `getfeerate` | None | network |
| `testInjectFeeEtas()` | `test_inject_fee_etas` | `feeEst*` | network |
| `removeLocalTx()` | `removelocaltx` | `txid*`, `walletPath` | loaded wallet |
| `getTxStatus()` | `get_tx_status` | `txid*`, `walletPath` | network, loaded wallet |
| `help()` | `help` | None | None |
| `addPeer()` | `add_peer` | `connectionString*`, `timeout`, `gossip`, `walletPath` | network, loaded wallet, Lightning wallet |
| `gossipInfo()` | `gossip_info` | `walletPath` | network, loaded wallet, Lightning wallet |
| `listPeers()` | `list_peers` | `gossip`, `walletPath` | network, loaded wallet, Lightning wallet |
| `openChannel()` | `open_channel` | `connectionString*`, `amount*`, `pushAmount`, `public`, `zeroconf`, `password`, `walletPath` | network, loaded wallet, wallet password if encrypted, Lightning wallet |
| `decodeInvoice()` | `decode_invoice` | `invoice*` | None |
| `lnPay()` | `lnpay` | `invoice*`, `timeout`, `maxCltv`, `maxFeeMsat`, `password`, `walletPath` | network, loaded wallet, wallet password if encrypted, Lightning wallet |
| `nodeId()` | `nodeid` | `walletPath` | loaded wallet, Lightning wallet |
| `listChannels()` | `list_channels` | `public`, `private`, `active`, `open`, `walletPath` | loaded wallet, Lightning wallet |
| `listChannelBackups()` | `list_channel_backups` | `walletPath` | loaded wallet, Lightning wallet |
| `enableHtlcSettle()` | `enable_htlc_settle` | `b*`, `walletPath` | network, loaded wallet, Lightning wallet |
| `clearLnBlacklist()` | `clear_ln_blacklist` | None | network |
| `resetLiquidityHints()` | `reset_liquidity_hints` | None | network |
| `closeChannel()` | `close_channel` | `channelPoint*`, `force`, `password`, `walletPath` | network, loaded wallet, wallet password if encrypted, Lightning wallet |
| `deleteChannel()` | `delete_channel` | `channelPoint*`, `password`, `walletPath` | loaded wallet, wallet password if encrypted, Lightning wallet |
| `deleteChannelBackup()` | `delete_channel_backup` | `channelPoint*`, `password`, `walletPath` | loaded wallet, wallet password if encrypted, Lightning wallet |
| `requestForceClose()` | `request_force_close` | `channelPoint*`, `connectionString`, `password`, `walletPath` | network, loaded wallet, wallet password if encrypted, Lightning wallet |
| `exportChannelBackup()` | `export_channel_backup` | `channelPoint*`, `password`, `walletPath` | loaded wallet, wallet password if encrypted, Lightning wallet |
| `importChannelBackup()` | `import_channel_backup` | `encrypted*`, `walletPath` | loaded wallet, Lightning wallet |
| `getChannelCtx()` | `get_channel_ctx` | `channelPoint*`, `password`, `iKnowWhatImDoing`, `walletPath` | network, loaded wallet, wallet password if encrypted, Lightning wallet |
| `listChannelHtlcs()` | `list_channel_htlcs` | `channelPoint*`, `password`, `walletPath` | network, loaded wallet, Lightning wallet |
| `getWatchtowerCtn()` | `get_watchtower_ctn` | `channelPoint*`, `walletPath` | network, loaded wallet, Lightning wallet |
| `rebalanceChannels()` | `rebalance_channels` | `fromScid*`, `destScid*`, `amount*`, `password`, `walletPath` | network, loaded wallet, wallet password if encrypted, Lightning wallet |
| `getSubmarineSwapProviders()` | `get_submarine_swap_providers` | `queryTime`, `walletPath` | network, loaded wallet, Lightning wallet |
| `normalSwap()` | `normal_swap` | `onchainAmount*`, `lightningAmount*`, `password`, `walletPath` | network, loaded wallet, wallet password if encrypted, Lightning wallet |
| `reverseSwap()` | `reverse_swap` | `lightningAmount*`, `onchainAmount*`, `prepayment`, `password`, `walletPath` | network, loaded wallet, wallet password if encrypted, Lightning wallet |
| `convertCurrency()` | `convert_currency` | `fromAmount`, `fromCcy`, `toCcy` | network |
| `sendOnionMessage()` | `send_onion_message` | `nodeIdOrBlindedPathHex*`, `message*`, `walletPath` | network, loaded wallet, Lightning wallet |
| `getBlindedPathVia()` | `get_blinded_path_via` | `nodeId*`, `dummyHops`, `walletPath` | network, loaded wallet, Lightning wallet |
| `ping()` | `ping` | None | None |
| `gui()` | `gui` | `configOptions*` | None |
| `runCmdline()` | `run_cmdline` | `configOptions*` | None |

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

An additional `history(params)` wrapper calls the legacy RPC name `history`
directly, with aliases for `walletPath`, `showAddresses`, and `showFiat`.
It is absent from this source snapshot. Newer versions expose `onchainHistory()`
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
including every camelCase alias. When updating Electrum support, inspect both
source files again, update the snapshot, wrappers, declarations and this table,
then run `yarn test`.
