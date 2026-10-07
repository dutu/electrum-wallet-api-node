import { JsonRpcTransport } from './transport.js'
import { mapParameters } from './options.js'

/** A thin Electrum wallet daemon client. Connection settings are immutable. */
export class ElectrumClient {
  #transport

  /**
   * @param {object} options
   * @param {string} options.url HTTP(S) URL of the full daemon RPC interface
   * @param {string} options.username Electrum's rpcuser
   * @param {string} options.password Electrum's rpcpassword
   * @param {number} [options.timeout=30000] Request timeout in milliseconds, including response reading
   */
  constructor(options) {
    this.#transport = new JsonRpcTransport(options)
  }

  /** Call an arbitrary RPC method without mapping its parameter names; return its result. */
  request(method, params) {
    return this.#transport.request(method, params)
  }

  getInfo(params) {
    return this.request('getinfo', mapParameters(params))
  }

  stop(params) {
    return this.request('stop', mapParameters(params))
  }

  listWallets(params) {
    return this.request('list_wallets', mapParameters(params))
  }

  loadWallet(params) {
    return this.request('load_wallet', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  closeWallet(params) {
    return this.request('close_wallet', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  create(params) {
    return this.request('create', mapParameters(params, { encryptFile: 'encrypt_file', seedType: 'seed_type', walletPath: 'wallet_path' }))
  }

  restore(params) {
    return this.request('restore', mapParameters(params, { encryptFile: 'encrypt_file', walletPath: 'wallet_path' }))
  }

  password(params) {
    return this.request('password', mapParameters(params, { newPassword: 'new_password', encryptFile: 'encrypt_file', walletPath: 'wallet_path' }))
  }

  get(params) {
    return this.request('get', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  getConfig(params) {
    return this.request('getconfig', mapParameters(params))
  }

  setConfig(params) {
    return this.request('setconfig', mapParameters(params))
  }

  unsetConfig(params) {
    return this.request('unsetconfig', mapParameters(params))
  }

  listConfig(params) {
    return this.request('listconfig', mapParameters(params))
  }

  helpConfig(params) {
    return this.request('helpconfig', mapParameters(params))
  }

  makeSeed(params) {
    return this.request('make_seed', mapParameters(params, { seedType: 'seed_type' }))
  }

  getAddressHistory(params) {
    return this.request('getaddresshistory', mapParameters(params))
  }

  unlock(params) {
    return this.request('unlock', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  listUnspent(params) {
    return this.request('listunspent', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  getAddressUnspent(params) {
    return this.request('getaddressunspent', mapParameters(params))
  }

  serialize(params) {
    return this.request('serialize', mapParameters(params, { jsonTx: 'jsontx' }))
  }

  signTransactionWithPrivkey(params) {
    return this.request('signtransaction_with_privkey', mapParameters(params))
  }

  signTransaction(params) {
    return this.request('signtransaction', mapParameters(params, { walletPath: 'wallet_path', ignoreWarnings: 'ignore_warnings' }))
  }

  deserialize(params) {
    return this.request('deserialize', mapParameters(params))
  }

  broadcast(params) {
    return this.request('broadcast', mapParameters(params))
  }

  createMultisig(params) {
    return this.request('createmultisig', mapParameters(params))
  }

  freeze(params) {
    return this.request('freeze', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  unfreeze(params) {
    return this.request('unfreeze', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  freezeUtxo(params) {
    return this.request('freeze_utxo', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  unfreezeUtxo(params) {
    return this.request('unfreeze_utxo', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  getPrivateKeys(params) {
    return this.request('getprivatekeys', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  getPrivateKeyForPath(params) {
    return this.request('getprivatekeyforpath', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  isMine(params) {
    return this.request('ismine', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  /** Deprecated upstream: returns a deprecation message. */
  dumpPrivKeys(params) {
    return this.request('dumpprivkeys', mapParameters(params))
  }

  validateAddress(params) {
    return this.request('validateaddress', mapParameters(params))
  }

  getPubKeys(params) {
    return this.request('getpubkeys', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  getBalance(params) {
    return this.request('getbalance', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  getAddressBalance(params) {
    return this.request('getaddressbalance', mapParameters(params))
  }

  getMerkle(params) {
    return this.request('getmerkle', mapParameters(params))
  }

  getServers(params) {
    return this.request('getservers', mapParameters(params))
  }

  version(params) {
    return this.request('version', mapParameters(params))
  }

  versionInfo(params) {
    return this.request('version_info', mapParameters(params))
  }

  getMpk(params) {
    return this.request('getmpk', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  getMasterPrivate(params) {
    return this.request('getmasterprivate', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  convertXkey(params) {
    return this.request('convert_xkey', mapParameters(params))
  }

  getSeed(params) {
    return this.request('getseed', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  importPrivkey(params) {
    return this.request('importprivkey', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  sweep(params) {
    return this.request('sweep', mapParameters(params, { feeRate: 'feerate' }))
  }

  signMessage(params) {
    return this.request('signmessage', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  verifyMessage(params) {
    return this.request('verifymessage', mapParameters(params))
  }

  payTo(params) {
    return this.request('payto', mapParameters(params, { feeRate: 'feerate', fromAddr: 'from_addr', fromCoins: 'from_coins', changeAddr: 'change_addr', addTransaction: 'addtransaction', walletPath: 'wallet_path' }))
  }

  payToMany(params) {
    return this.request('paytomany', mapParameters(params, { feeRate: 'feerate', fromAddr: 'from_addr', fromCoins: 'from_coins', changeAddr: 'change_addr', addTransaction: 'addtransaction', walletPath: 'wallet_path' }))
  }

  onchainCapitalGains(params) {
    return this.request('onchain_capital_gains', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  bumpFee(params) {
    return this.request('bumpfee', mapParameters(params, { newFeeRate: 'new_fee_rate', fromCoins: 'from_coins', decreasePayment: 'decrease_payment', walletPath: 'wallet_path' }))
  }

  dsCancel(params) {
    return this.request('dscancel', mapParameters(params, { newFeeRate: 'new_fee_rate', walletPath: 'wallet_path' }))
  }

  onchainHistory(params) {
    return this.request('onchain_history', mapParameters(params, { showFiat: 'show_fiat', showAddresses: 'show_addresses', fromHeight: 'from_height', toHeight: 'to_height', walletPath: 'wallet_path' }))
  }

  lightningHistory(params) {
    return this.request('lightning_history', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  setLabel(params) {
    return this.request('setlabel', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  listContacts(params) {
    return this.request('listcontacts', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  getOpenAlias(params) {
    return this.request('getopenalias', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  searchContacts(params) {
    return this.request('searchcontacts', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  listAddresses(params) {
    return this.request('listaddresses', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  getTransaction(params) {
    return this.request('gettransaction', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  encrypt(params) {
    return this.request('encrypt', mapParameters(params))
  }

  decrypt(params) {
    return this.request('decrypt', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  getRequest(params) {
    return this.request('get_request', mapParameters(params, { requestId: 'request_id', walletPath: 'wallet_path' }))
  }

  getInvoice(params) {
    return this.request('get_invoice', mapParameters(params, { invoiceId: 'invoice_id', walletPath: 'wallet_path' }))
  }

  listRequests(params) {
    return this.request('list_requests', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  listInvoices(params) {
    return this.request('list_invoices', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  createNewAddress(params) {
    return this.request('createnewaddress', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  changeGapLimit(params) {
    return this.request('changegaplimit', mapParameters(params, { newLimit: 'new_limit', iKnowWhatImDoing: 'iknowwhatimdoing', walletPath: 'wallet_path' }))
  }

  getMinAcceptableGap(params) {
    return this.request('getminacceptablegap', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  getUnusedAddress(params) {
    return this.request('getunusedaddress', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  addRequest(params) {
    return this.request('add_request', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  addHoldInvoice(params) {
    return this.request('add_hold_invoice', mapParameters(params, { paymentHash: 'payment_hash', minFinalCltvExpiryDelta: 'min_final_cltv_expiry_delta', walletPath: 'wallet_path' }))
  }

  settleHoldInvoice(params) {
    return this.request('settle_hold_invoice', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  cancelHoldInvoice(params) {
    return this.request('cancel_hold_invoice', mapParameters(params, { paymentHash: 'payment_hash', walletPath: 'wallet_path' }))
  }

  checkHoldInvoice(params) {
    return this.request('check_hold_invoice', mapParameters(params, { paymentHash: 'payment_hash', walletPath: 'wallet_path' }))
  }

  exportLightningPreimage(params) {
    return this.request('export_lightning_preimage', mapParameters(params, { paymentHash: 'payment_hash', walletPath: 'wallet_path' }))
  }

  addTransaction(params) {
    return this.request('addtransaction', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  deleteRequest(params) {
    return this.request('delete_request', mapParameters(params, { requestId: 'request_id', walletPath: 'wallet_path' }))
  }

  deleteInvoice(params) {
    return this.request('delete_invoice', mapParameters(params, { invoiceId: 'invoice_id', walletPath: 'wallet_path' }))
  }

  clearRequests(params) {
    return this.request('clear_requests', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  clearInvoices(params) {
    return this.request('clear_invoices', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  notify(params) {
    return this.request('notify', mapParameters(params, { url: 'URL' }))
  }

  isSynchronized(params) {
    return this.request('is_synchronized', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  waitForSync(params) {
    return this.request('wait_for_sync', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  getFeeRate(params) {
    return this.request('getfeerate', mapParameters(params))
  }

  /** Electrum diagnostic command for injecting fee estimates (e.g. regtest). */
  testInjectFeeEtas(params) {
    return this.request('test_inject_fee_etas', mapParameters(params, { feeEst: 'fee_est' }))
  }

  removeLocalTx(params) {
    return this.request('removelocaltx', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  getTxStatus(params) {
    return this.request('get_tx_status', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  help(params) {
    return this.request('help', mapParameters(params))
  }

  addPeer(params) {
    return this.request('add_peer', mapParameters(params, { connectionString: 'connection_string', walletPath: 'wallet_path' }))
  }

  gossipInfo(params) {
    return this.request('gossip_info', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  listPeers(params) {
    return this.request('list_peers', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  openChannel(params) {
    return this.request('open_channel', mapParameters(params, { connectionString: 'connection_string', pushAmount: 'push_amount', walletPath: 'wallet_path' }))
  }

  decodeInvoice(params) {
    return this.request('decode_invoice', mapParameters(params))
  }

  lnPay(params) {
    return this.request('lnpay', mapParameters(params, { maxCltv: 'max_cltv', maxFeeMsat: 'max_fee_msat', walletPath: 'wallet_path' }))
  }

  nodeId(params) {
    return this.request('nodeid', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  listChannels(params) {
    return this.request('list_channels', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  listChannelBackups(params) {
    return this.request('list_channel_backups', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  enableHtlcSettle(params) {
    return this.request('enable_htlc_settle', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  clearLnBlacklist(params) {
    return this.request('clear_ln_blacklist', mapParameters(params))
  }

  resetLiquidityHints(params) {
    return this.request('reset_liquidity_hints', mapParameters(params))
  }

  closeChannel(params) {
    return this.request('close_channel', mapParameters(params, { channelPoint: 'channel_point', walletPath: 'wallet_path' }))
  }

  deleteChannel(params) {
    return this.request('delete_channel', mapParameters(params, { channelPoint: 'channel_point', walletPath: 'wallet_path' }))
  }

  deleteChannelBackup(params) {
    return this.request('delete_channel_backup', mapParameters(params, { channelPoint: 'channel_point', walletPath: 'wallet_path' }))
  }

  requestForceClose(params) {
    return this.request('request_force_close', mapParameters(params, { channelPoint: 'channel_point', connectionString: 'connection_string', walletPath: 'wallet_path' }))
  }

  exportChannelBackup(params) {
    return this.request('export_channel_backup', mapParameters(params, { channelPoint: 'channel_point', walletPath: 'wallet_path' }))
  }

  importChannelBackup(params) {
    return this.request('import_channel_backup', mapParameters(params, { walletPath: 'wallet_path' }))
  }

  getChannelCtx(params) {
    return this.request('get_channel_ctx', mapParameters(params, { channelPoint: 'channel_point', iKnowWhatImDoing: 'iknowwhatimdoing', walletPath: 'wallet_path' }))
  }

  listChannelHtlcs(params) {
    return this.request('list_channel_htlcs', mapParameters(params, { channelPoint: 'channel_point', walletPath: 'wallet_path' }))
  }

  getWatchtowerCtn(params) {
    return this.request('get_watchtower_ctn', mapParameters(params, { channelPoint: 'channel_point', walletPath: 'wallet_path' }))
  }

  rebalanceChannels(params) {
    return this.request('rebalance_channels', mapParameters(params, { fromScid: 'from_scid', destScid: 'dest_scid', walletPath: 'wallet_path' }))
  }

  getSubmarineSwapProviders(params) {
    return this.request('get_submarine_swap_providers', mapParameters(params, { queryTime: 'query_time', walletPath: 'wallet_path' }))
  }

  normalSwap(params) {
    return this.request('normal_swap', mapParameters(params, { onchainAmount: 'onchain_amount', lightningAmount: 'lightning_amount', walletPath: 'wallet_path' }))
  }

  reverseSwap(params) {
    return this.request('reverse_swap', mapParameters(params, { lightningAmount: 'lightning_amount', onchainAmount: 'onchain_amount', walletPath: 'wallet_path' }))
  }

  convertCurrency(params) {
    return this.request('convert_currency', mapParameters(params, { fromAmount: 'from_amount', fromCcy: 'from_ccy', toCcy: 'to_ccy' }))
  }

  sendOnionMessage(params) {
    return this.request('send_onion_message', mapParameters(params, { nodeIdOrBlindedPathHex: 'node_id_or_blinded_path_hex', walletPath: 'wallet_path' }))
  }

  getBlindedPathVia(params) {
    return this.request('get_blinded_path_via', mapParameters(params, { nodeId: 'node_id', dummyHops: 'dummy_hops', walletPath: 'wallet_path' }))
  }

  ping(params) {
    return this.request('ping', mapParameters(params))
  }

  gui(params) {
    return this.request('gui', mapParameters(params, { configOptions: 'config_options' }))
  }

  runCmdline(params) {
    return this.request('run_cmdline', mapParameters(params, { configOptions: 'config_options' }))
  }

  /** Legacy Electrum RPC; newer versions expose onchainHistory() and lightningHistory(). */
  history(params) {
    return this.request('history', mapParameters(params, { showAddresses: 'show_addresses', showFiat: 'show_fiat', walletPath: 'wallet_path' }))
  }
}
