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

  /**
   * Call an arbitrary RPC method without mapping its parameter names; return its result.
   * options.timeout and options.signal configure only this request and are never sent to Electrum.
   */
  request(method, params = {}, options = {}) {
    return this.#transport.request(method, params, options)
  }

  getInfo(params = {}, options = {}) {
    return this.request('getinfo', mapParameters(params), options)
  }

  stop(params = {}, options = {}) {
    return this.request('stop', mapParameters(params), options)
  }

  listWallets(params = {}, options = {}) {
    return this.request('list_wallets', mapParameters(params), options)
  }

  loadWallet(params = {}, options = {}) {
    return this.request('load_wallet', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  closeWallet(params = {}, options = {}) {
    return this.request('close_wallet', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  create(params = {}, options = {}) {
    return this.request('create', mapParameters(params, { encryptFile: 'encrypt_file', seedType: 'seed_type', walletPath: 'wallet_path' }), options)
  }

  restore(params = {}, options = {}) {
    return this.request('restore', mapParameters(params, { encryptFile: 'encrypt_file', walletPath: 'wallet_path' }), options)
  }

  password(params = {}, options = {}) {
    return this.request('password', mapParameters(params, { newPassword: 'new_password', encryptFile: 'encrypt_file', walletPath: 'wallet_path' }), options)
  }

  get(params = {}, options = {}) {
    return this.request('get', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  getConfig(params = {}, options = {}) {
    return this.request('getconfig', mapParameters(params), options)
  }

  setConfig(params = {}, options = {}) {
    return this.request('setconfig', mapParameters(params), options)
  }

  unsetConfig(params = {}, options = {}) {
    return this.request('unsetconfig', mapParameters(params), options)
  }

  listConfig(params = {}, options = {}) {
    return this.request('listconfig', mapParameters(params), options)
  }

  helpConfig(params = {}, options = {}) {
    return this.request('helpconfig', mapParameters(params), options)
  }

  makeSeed(params = {}, options = {}) {
    return this.request('make_seed', mapParameters(params, { seedType: 'seed_type' }), options)
  }

  getAddressHistory(params = {}, options = {}) {
    return this.request('getaddresshistory', mapParameters(params), options)
  }

  unlock(params = {}, options = {}) {
    return this.request('unlock', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  listUnspent(params = {}, options = {}) {
    return this.request('listunspent', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  getAddressUnspent(params = {}, options = {}) {
    return this.request('getaddressunspent', mapParameters(params), options)
  }

  serialize(params = {}, options = {}) {
    return this.request('serialize', mapParameters(params, { jsonTx: 'jsontx' }), options)
  }

  signTransactionWithPrivkey(params = {}, options = {}) {
    return this.request('signtransaction_with_privkey', mapParameters(params), options)
  }

  signTransaction(params = {}, options = {}) {
    return this.request('signtransaction', mapParameters(params, { walletPath: 'wallet_path', ignoreWarnings: 'ignore_warnings' }), options)
  }

  deserialize(params = {}, options = {}) {
    return this.request('deserialize', mapParameters(params), options)
  }

  broadcast(params = {}, options = {}) {
    return this.request('broadcast', mapParameters(params), options)
  }

  createMultisig(params = {}, options = {}) {
    return this.request('createmultisig', mapParameters(params), options)
  }

  freeze(params = {}, options = {}) {
    return this.request('freeze', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  unfreeze(params = {}, options = {}) {
    return this.request('unfreeze', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  freezeUtxo(params = {}, options = {}) {
    return this.request('freeze_utxo', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  unfreezeUtxo(params = {}, options = {}) {
    return this.request('unfreeze_utxo', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  getPrivateKeys(params = {}, options = {}) {
    return this.request('getprivatekeys', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  getPrivateKeyForPath(params = {}, options = {}) {
    return this.request('getprivatekeyforpath', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  isMine(params = {}, options = {}) {
    return this.request('ismine', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  /** Deprecated upstream: returns a deprecation message. */
  dumpPrivKeys(params = {}, options = {}) {
    return this.request('dumpprivkeys', mapParameters(params), options)
  }

  validateAddress(params = {}, options = {}) {
    return this.request('validateaddress', mapParameters(params), options)
  }

  getPubKeys(params = {}, options = {}) {
    return this.request('getpubkeys', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  getBalance(params = {}, options = {}) {
    return this.request('getbalance', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  getAddressBalance(params = {}, options = {}) {
    return this.request('getaddressbalance', mapParameters(params), options)
  }

  getMerkle(params = {}, options = {}) {
    return this.request('getmerkle', mapParameters(params), options)
  }

  getServers(params = {}, options = {}) {
    return this.request('getservers', mapParameters(params), options)
  }

  version(params = {}, options = {}) {
    return this.request('version', mapParameters(params), options)
  }

  versionInfo(params = {}, options = {}) {
    return this.request('version_info', mapParameters(params), options)
  }

  getMpk(params = {}, options = {}) {
    return this.request('getmpk', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  getMasterPrivate(params = {}, options = {}) {
    return this.request('getmasterprivate', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  convertXkey(params = {}, options = {}) {
    return this.request('convert_xkey', mapParameters(params), options)
  }

  getSeed(params = {}, options = {}) {
    return this.request('getseed', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  importPrivkey(params = {}, options = {}) {
    return this.request('importprivkey', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  sweep(params = {}, options = {}) {
    return this.request('sweep', mapParameters(params, { feeRate: 'feerate' }), options)
  }

  signMessage(params = {}, options = {}) {
    return this.request('signmessage', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  verifyMessage(params = {}, options = {}) {
    return this.request('verifymessage', mapParameters(params), options)
  }

  payTo(params = {}, options = {}) {
    return this.request('payto', mapParameters(params, { feeRate: 'feerate', fromAddr: 'from_addr', fromCoins: 'from_coins', changeAddr: 'change_addr', addTransaction: 'addtransaction', walletPath: 'wallet_path' }), options)
  }

  payToMany(params = {}, options = {}) {
    return this.request('paytomany', mapParameters(params, { feeRate: 'feerate', fromAddr: 'from_addr', fromCoins: 'from_coins', changeAddr: 'change_addr', addTransaction: 'addtransaction', walletPath: 'wallet_path' }), options)
  }

  onchainCapitalGains(params = {}, options = {}) {
    return this.request('onchain_capital_gains', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  bumpFee(params = {}, options = {}) {
    return this.request('bumpfee', mapParameters(params, { newFeeRate: 'new_fee_rate', fromCoins: 'from_coins', decreasePayment: 'decrease_payment', walletPath: 'wallet_path' }), options)
  }

  dsCancel(params = {}, options = {}) {
    return this.request('dscancel', mapParameters(params, { newFeeRate: 'new_fee_rate', walletPath: 'wallet_path' }), options)
  }

  onchainHistory(params = {}, options = {}) {
    return this.request('onchain_history', mapParameters(params, { showFiat: 'show_fiat', showAddresses: 'show_addresses', fromHeight: 'from_height', toHeight: 'to_height', walletPath: 'wallet_path' }), options)
  }

  lightningHistory(params = {}, options = {}) {
    return this.request('lightning_history', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  setLabel(params = {}, options = {}) {
    return this.request('setlabel', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  listContacts(params = {}, options = {}) {
    return this.request('listcontacts', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  getOpenAlias(params = {}, options = {}) {
    return this.request('getopenalias', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  searchContacts(params = {}, options = {}) {
    return this.request('searchcontacts', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  listAddresses(params = {}, options = {}) {
    return this.request('listaddresses', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  getTransaction(params = {}, options = {}) {
    return this.request('gettransaction', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  encrypt(params = {}, options = {}) {
    return this.request('encrypt', mapParameters(params), options)
  }

  decrypt(params = {}, options = {}) {
    return this.request('decrypt', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  getRequest(params = {}, options = {}) {
    return this.request('get_request', mapParameters(params, { requestId: 'request_id', walletPath: 'wallet_path' }), options)
  }

  getInvoice(params = {}, options = {}) {
    return this.request('get_invoice', mapParameters(params, { invoiceId: 'invoice_id', walletPath: 'wallet_path' }), options)
  }

  listRequests(params = {}, options = {}) {
    return this.request('list_requests', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  listInvoices(params = {}, options = {}) {
    return this.request('list_invoices', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  createNewAddress(params = {}, options = {}) {
    return this.request('createnewaddress', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  changeGapLimit(params = {}, options = {}) {
    return this.request('changegaplimit', mapParameters(params, { newLimit: 'new_limit', iKnowWhatImDoing: 'iknowwhatimdoing', walletPath: 'wallet_path' }), options)
  }

  getMinAcceptableGap(params = {}, options = {}) {
    return this.request('getminacceptablegap', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  getUnusedAddress(params = {}, options = {}) {
    return this.request('getunusedaddress', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  addRequest(params = {}, options = {}) {
    return this.request('add_request', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  addHoldInvoice(params = {}, options = {}) {
    return this.request('add_hold_invoice', mapParameters(params, { paymentHash: 'payment_hash', minFinalCltvExpiryDelta: 'min_final_cltv_expiry_delta', walletPath: 'wallet_path' }), options)
  }

  settleHoldInvoice(params = {}, options = {}) {
    return this.request('settle_hold_invoice', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  cancelHoldInvoice(params = {}, options = {}) {
    return this.request('cancel_hold_invoice', mapParameters(params, { paymentHash: 'payment_hash', walletPath: 'wallet_path' }), options)
  }

  checkHoldInvoice(params = {}, options = {}) {
    return this.request('check_hold_invoice', mapParameters(params, { paymentHash: 'payment_hash', walletPath: 'wallet_path' }), options)
  }

  exportLightningPreimage(params = {}, options = {}) {
    return this.request('export_lightning_preimage', mapParameters(params, { paymentHash: 'payment_hash', walletPath: 'wallet_path' }), options)
  }

  addTransaction(params = {}, options = {}) {
    return this.request('addtransaction', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  deleteRequest(params = {}, options = {}) {
    return this.request('delete_request', mapParameters(params, { requestId: 'request_id', walletPath: 'wallet_path' }), options)
  }

  deleteInvoice(params = {}, options = {}) {
    return this.request('delete_invoice', mapParameters(params, { invoiceId: 'invoice_id', walletPath: 'wallet_path' }), options)
  }

  clearRequests(params = {}, options = {}) {
    return this.request('clear_requests', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  clearInvoices(params = {}, options = {}) {
    return this.request('clear_invoices', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  notify(params = {}, options = {}) {
    return this.request('notify', mapParameters(params, { url: 'URL' }), options)
  }

  isSynchronized(params = {}, options = {}) {
    return this.request('is_synchronized', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  waitForSync(params = {}, options = {}) {
    return this.request('wait_for_sync', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  getFeeRate(params = {}, options = {}) {
    return this.request('getfeerate', mapParameters(params), options)
  }

  /** Electrum diagnostic command for injecting fee estimates (e.g. regtest). */
  testInjectFeeEtas(params = {}, options = {}) {
    return this.request('test_inject_fee_etas', mapParameters(params, { feeEst: 'fee_est' }), options)
  }

  removeLocalTx(params = {}, options = {}) {
    return this.request('removelocaltx', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  getTxStatus(params = {}, options = {}) {
    return this.request('get_tx_status', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  help(params = {}, options = {}) {
    return this.request('help', mapParameters(params), options)
  }

  addPeer(params = {}, options = {}) {
    return this.request('add_peer', mapParameters(params, { connectionString: 'connection_string', walletPath: 'wallet_path' }), options)
  }

  gossipInfo(params = {}, options = {}) {
    return this.request('gossip_info', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  listPeers(params = {}, options = {}) {
    return this.request('list_peers', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  openChannel(params = {}, options = {}) {
    return this.request('open_channel', mapParameters(params, { connectionString: 'connection_string', pushAmount: 'push_amount', walletPath: 'wallet_path' }), options)
  }

  decodeInvoice(params = {}, options = {}) {
    return this.request('decode_invoice', mapParameters(params), options)
  }

  lnPay(params = {}, options = {}) {
    return this.request('lnpay', mapParameters(params, { maxCltv: 'max_cltv', maxFeeMsat: 'max_fee_msat', walletPath: 'wallet_path' }), options)
  }

  nodeId(params = {}, options = {}) {
    return this.request('nodeid', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  listChannels(params = {}, options = {}) {
    return this.request('list_channels', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  listChannelBackups(params = {}, options = {}) {
    return this.request('list_channel_backups', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  enableHtlcSettle(params = {}, options = {}) {
    return this.request('enable_htlc_settle', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  clearLnBlacklist(params = {}, options = {}) {
    return this.request('clear_ln_blacklist', mapParameters(params), options)
  }

  resetLiquidityHints(params = {}, options = {}) {
    return this.request('reset_liquidity_hints', mapParameters(params), options)
  }

  closeChannel(params = {}, options = {}) {
    return this.request('close_channel', mapParameters(params, { channelPoint: 'channel_point', walletPath: 'wallet_path' }), options)
  }

  deleteChannel(params = {}, options = {}) {
    return this.request('delete_channel', mapParameters(params, { channelPoint: 'channel_point', walletPath: 'wallet_path' }), options)
  }

  deleteChannelBackup(params = {}, options = {}) {
    return this.request('delete_channel_backup', mapParameters(params, { channelPoint: 'channel_point', walletPath: 'wallet_path' }), options)
  }

  requestForceClose(params = {}, options = {}) {
    return this.request('request_force_close', mapParameters(params, { channelPoint: 'channel_point', connectionString: 'connection_string', walletPath: 'wallet_path' }), options)
  }

  exportChannelBackup(params = {}, options = {}) {
    return this.request('export_channel_backup', mapParameters(params, { channelPoint: 'channel_point', walletPath: 'wallet_path' }), options)
  }

  importChannelBackup(params = {}, options = {}) {
    return this.request('import_channel_backup', mapParameters(params, { walletPath: 'wallet_path' }), options)
  }

  getChannelCtx(params = {}, options = {}) {
    return this.request('get_channel_ctx', mapParameters(params, { channelPoint: 'channel_point', iKnowWhatImDoing: 'iknowwhatimdoing', walletPath: 'wallet_path' }), options)
  }

  listChannelHtlcs(params = {}, options = {}) {
    return this.request('list_channel_htlcs', mapParameters(params, { channelPoint: 'channel_point', walletPath: 'wallet_path' }), options)
  }

  getWatchtowerCtn(params = {}, options = {}) {
    return this.request('get_watchtower_ctn', mapParameters(params, { channelPoint: 'channel_point', walletPath: 'wallet_path' }), options)
  }

  rebalanceChannels(params = {}, options = {}) {
    return this.request('rebalance_channels', mapParameters(params, { fromScid: 'from_scid', destScid: 'dest_scid', walletPath: 'wallet_path' }), options)
  }

  getSubmarineSwapProviders(params = {}, options = {}) {
    return this.request('get_submarine_swap_providers', mapParameters(params, { queryTime: 'query_time', walletPath: 'wallet_path' }), options)
  }

  normalSwap(params = {}, options = {}) {
    return this.request('normal_swap', mapParameters(params, { onchainAmount: 'onchain_amount', lightningAmount: 'lightning_amount', walletPath: 'wallet_path' }), options)
  }

  reverseSwap(params = {}, options = {}) {
    return this.request('reverse_swap', mapParameters(params, { lightningAmount: 'lightning_amount', onchainAmount: 'onchain_amount', walletPath: 'wallet_path' }), options)
  }

  convertCurrency(params = {}, options = {}) {
    return this.request('convert_currency', mapParameters(params, { fromAmount: 'from_amount', fromCcy: 'from_ccy', toCcy: 'to_ccy' }), options)
  }

  sendOnionMessage(params = {}, options = {}) {
    return this.request('send_onion_message', mapParameters(params, { nodeIdOrBlindedPathHex: 'node_id_or_blinded_path_hex', walletPath: 'wallet_path' }), options)
  }

  getBlindedPathVia(params = {}, options = {}) {
    return this.request('get_blinded_path_via', mapParameters(params, { nodeId: 'node_id', dummyHops: 'dummy_hops', walletPath: 'wallet_path' }), options)
  }

  ping(params = {}, options = {}) {
    return this.request('ping', mapParameters(params), options)
  }

  gui(params = {}, options = {}) {
    return this.request('gui', mapParameters(params, { configOptions: 'config_options' }), options)
  }

  runCmdline(params = {}, options = {}) {
    return this.request('run_cmdline', mapParameters(params, { configOptions: 'config_options' }), options)
  }

  /** Legacy Electrum RPC; newer versions expose onchainHistory() and lightningHistory(). */
  history(params = {}, options = {}) {
    return this.request('history', mapParameters(params, { showAddresses: 'show_addresses', showFiat: 'show_fiat', walletPath: 'wallet_path' }), options)
  }
}
