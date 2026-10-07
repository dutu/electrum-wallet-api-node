/** Connection options use HTTP Basic Authentication. */
export interface ElectrumClientOptions {
  url: string
  username: string
  password: string
  /** Integer milliseconds between 1 and 2147483647; defaults to 30000. */
  timeout?: number | undefined
}

/** Named parameters are left for Electrum to validate, including additional future fields. */
export interface ElectrumNamedParams {
  [parameter: string]: unknown
}

/** Generic request() also accepts Electrum's positional parameter form. */
export type ElectrumRpcParams = ElectrumNamedParams | unknown[]

export interface ElectrumRpcErrorDetails {
  code: number
  message: string
  data?: unknown
  [field: string]: unknown
}

export interface ElectrumRpcErrorResponse {
  jsonrpc: '2.0'
  id: string
  error: ElectrumRpcErrorDetails
  [field: string]: unknown
}

/** Results are returned unchanged. Supply a result type appropriate to your Electrum version. */
export class ElectrumClient {
  constructor(options: ElectrumClientOptions)
  request<Result = unknown>(method: string, params?: ElectrumRpcParams): Promise<Result>
  getInfo<Result = unknown>(params?: ElectrumNamedParams): Promise<Result>
  stop<Result = unknown>(params?: ElectrumNamedParams): Promise<Result>
  listWallets<Result = unknown>(params?: ElectrumNamedParams): Promise<Result>
  loadWallet<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown; password?: unknown }): Promise<Result>
  closeWallet<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }): Promise<Result>
  create<Result = unknown>(params?: ElectrumNamedParams & { passphrase?: unknown; password?: unknown; encryptFile?: unknown; seedType?: unknown; walletPath?: unknown }): Promise<Result>
  restore<Result = unknown>(params?: ElectrumNamedParams & { text?: unknown; passphrase?: unknown; password?: unknown; encryptFile?: unknown; walletPath?: unknown }): Promise<Result>
  password<Result = unknown>(params?: ElectrumNamedParams & { password?: unknown; newPassword?: unknown; encryptFile?: unknown; walletPath?: unknown }): Promise<Result>
  get<Result = unknown>(params?: ElectrumNamedParams & { key?: unknown; walletPath?: unknown }): Promise<Result>
  getConfig<Result = unknown>(params?: ElectrumNamedParams & { key?: unknown }): Promise<Result>
  setConfig<Result = unknown>(params?: ElectrumNamedParams & { key?: unknown; value?: unknown }): Promise<Result>
  unsetConfig<Result = unknown>(params?: ElectrumNamedParams & { key?: unknown }): Promise<Result>
  listConfig<Result = unknown>(params?: ElectrumNamedParams): Promise<Result>
  helpConfig<Result = unknown>(params?: ElectrumNamedParams & { key?: unknown }): Promise<Result>
  makeSeed<Result = unknown>(params?: ElectrumNamedParams & { nbits?: unknown; language?: unknown; seedType?: unknown }): Promise<Result>
  getAddressHistory<Result = unknown>(params?: ElectrumNamedParams & { address?: unknown }): Promise<Result>
  unlock<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown; password?: unknown }): Promise<Result>
  listUnspent<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }): Promise<Result>
  getAddressUnspent<Result = unknown>(params?: ElectrumNamedParams & { address?: unknown }): Promise<Result>
  serialize<Result = unknown>(params?: ElectrumNamedParams & { jsonTx?: unknown }): Promise<Result>
  signTransactionWithPrivkey<Result = unknown>(params?: ElectrumNamedParams & { tx?: unknown; privkey?: unknown }): Promise<Result>
  signTransaction<Result = unknown>(params?: ElectrumNamedParams & { tx?: unknown; password?: unknown; walletPath?: unknown; ignoreWarnings?: unknown }): Promise<Result>
  deserialize<Result = unknown>(params?: ElectrumNamedParams & { tx?: unknown }): Promise<Result>
  broadcast<Result = unknown>(params?: ElectrumNamedParams & { tx?: unknown }): Promise<Result>
  createMultisig<Result = unknown>(params?: ElectrumNamedParams & { num?: unknown; pubkeys?: unknown }): Promise<Result>
  freeze<Result = unknown>(params?: ElectrumNamedParams & { address?: unknown; walletPath?: unknown }): Promise<Result>
  unfreeze<Result = unknown>(params?: ElectrumNamedParams & { address?: unknown; walletPath?: unknown }): Promise<Result>
  freezeUtxo<Result = unknown>(params?: ElectrumNamedParams & { coin?: unknown; walletPath?: unknown }): Promise<Result>
  unfreezeUtxo<Result = unknown>(params?: ElectrumNamedParams & { coin?: unknown; walletPath?: unknown }): Promise<Result>
  getPrivateKeys<Result = unknown>(params?: ElectrumNamedParams & { address?: unknown; password?: unknown; walletPath?: unknown }): Promise<Result>
  getPrivateKeyForPath<Result = unknown>(params?: ElectrumNamedParams & { path?: unknown; password?: unknown; walletPath?: unknown }): Promise<Result>
  isMine<Result = unknown>(params?: ElectrumNamedParams & { address?: unknown; walletPath?: unknown }): Promise<Result>
  dumpPrivKeys<Result = unknown>(params?: ElectrumNamedParams): Promise<Result>
  validateAddress<Result = unknown>(params?: ElectrumNamedParams & { address?: unknown }): Promise<Result>
  getPubKeys<Result = unknown>(params?: ElectrumNamedParams & { address?: unknown; walletPath?: unknown }): Promise<Result>
  getBalance<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }): Promise<Result>
  getAddressBalance<Result = unknown>(params?: ElectrumNamedParams & { address?: unknown }): Promise<Result>
  getMerkle<Result = unknown>(params?: ElectrumNamedParams & { txid?: unknown; height?: unknown }): Promise<Result>
  getServers<Result = unknown>(params?: ElectrumNamedParams): Promise<Result>
  version<Result = unknown>(params?: ElectrumNamedParams): Promise<Result>
  versionInfo<Result = unknown>(params?: ElectrumNamedParams): Promise<Result>
  getMpk<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }): Promise<Result>
  getMasterPrivate<Result = unknown>(params?: ElectrumNamedParams & { password?: unknown; walletPath?: unknown }): Promise<Result>
  convertXkey<Result = unknown>(params?: ElectrumNamedParams & { xkey?: unknown; xtype?: unknown }): Promise<Result>
  getSeed<Result = unknown>(params?: ElectrumNamedParams & { password?: unknown; walletPath?: unknown }): Promise<Result>
  importPrivkey<Result = unknown>(params?: ElectrumNamedParams & { privkey?: unknown; password?: unknown; walletPath?: unknown }): Promise<Result>
  sweep<Result = unknown>(params?: ElectrumNamedParams & { privkey?: unknown; destination?: unknown; fee?: unknown; feeRate?: unknown; imax?: unknown }): Promise<Result>
  signMessage<Result = unknown>(params?: ElectrumNamedParams & { address?: unknown; message?: unknown; password?: unknown; walletPath?: unknown }): Promise<Result>
  verifyMessage<Result = unknown>(params?: ElectrumNamedParams & { address?: unknown; signature?: unknown; message?: unknown }): Promise<Result>
  payTo<Result = unknown>(params?: ElectrumNamedParams & { destination?: unknown; amount?: unknown; fee?: unknown; feeRate?: unknown; fromAddr?: unknown; fromCoins?: unknown; changeAddr?: unknown; unsigned?: unknown; rbf?: unknown; password?: unknown; locktime?: unknown; addTransaction?: unknown; walletPath?: unknown }): Promise<Result>
  payToMany<Result = unknown>(params?: ElectrumNamedParams & { outputs?: unknown; fee?: unknown; feeRate?: unknown; fromAddr?: unknown; fromCoins?: unknown; changeAddr?: unknown; unsigned?: unknown; rbf?: unknown; password?: unknown; locktime?: unknown; addTransaction?: unknown; walletPath?: unknown }): Promise<Result>
  onchainCapitalGains<Result = unknown>(params?: ElectrumNamedParams & { year?: unknown; walletPath?: unknown }): Promise<Result>
  bumpFee<Result = unknown>(params?: ElectrumNamedParams & { tx?: unknown; newFeeRate?: unknown; fromCoins?: unknown; decreasePayment?: unknown; password?: unknown; unsigned?: unknown; walletPath?: unknown }): Promise<Result>
  dsCancel<Result = unknown>(params?: ElectrumNamedParams & { tx?: unknown; newFeeRate?: unknown; password?: unknown; unsigned?: unknown; walletPath?: unknown }): Promise<Result>
  onchainHistory<Result = unknown>(params?: ElectrumNamedParams & { showFiat?: unknown; year?: unknown; showAddresses?: unknown; fromHeight?: unknown; toHeight?: unknown; walletPath?: unknown }): Promise<Result>
  lightningHistory<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }): Promise<Result>
  setLabel<Result = unknown>(params?: ElectrumNamedParams & { key?: unknown; label?: unknown; walletPath?: unknown }): Promise<Result>
  listContacts<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }): Promise<Result>
  getOpenAlias<Result = unknown>(params?: ElectrumNamedParams & { key?: unknown; walletPath?: unknown }): Promise<Result>
  searchContacts<Result = unknown>(params?: ElectrumNamedParams & { query?: unknown; walletPath?: unknown }): Promise<Result>
  listAddresses<Result = unknown>(params?: ElectrumNamedParams & { receiving?: unknown; change?: unknown; labels?: unknown; frozen?: unknown; unused?: unknown; funded?: unknown; balance?: unknown; walletPath?: unknown }): Promise<Result>
  getTransaction<Result = unknown>(params?: ElectrumNamedParams & { txid?: unknown; walletPath?: unknown }): Promise<Result>
  encrypt<Result = unknown>(params?: ElectrumNamedParams & { pubkey?: unknown; message?: unknown }): Promise<Result>
  decrypt<Result = unknown>(params?: ElectrumNamedParams & { pubkey?: unknown; encrypted?: unknown; password?: unknown; walletPath?: unknown }): Promise<Result>
  getRequest<Result = unknown>(params?: ElectrumNamedParams & { requestId?: unknown; walletPath?: unknown }): Promise<Result>
  getInvoice<Result = unknown>(params?: ElectrumNamedParams & { invoiceId?: unknown; walletPath?: unknown }): Promise<Result>
  listRequests<Result = unknown>(params?: ElectrumNamedParams & { pending?: unknown; expired?: unknown; paid?: unknown; walletPath?: unknown }): Promise<Result>
  listInvoices<Result = unknown>(params?: ElectrumNamedParams & { pending?: unknown; expired?: unknown; paid?: unknown; walletPath?: unknown }): Promise<Result>
  createNewAddress<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }): Promise<Result>
  changeGapLimit<Result = unknown>(params?: ElectrumNamedParams & { newLimit?: unknown; iKnowWhatImDoing?: unknown; walletPath?: unknown }): Promise<Result>
  getMinAcceptableGap<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }): Promise<Result>
  getUnusedAddress<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }): Promise<Result>
  addRequest<Result = unknown>(params?: ElectrumNamedParams & { amount?: unknown; memo?: unknown; expiry?: unknown; lightning?: unknown; force?: unknown; walletPath?: unknown }): Promise<Result>
  addHoldInvoice<Result = unknown>(params?: ElectrumNamedParams & { paymentHash?: unknown; amount?: unknown; memo?: unknown; expiry?: unknown; minFinalCltvExpiryDelta?: unknown; walletPath?: unknown }): Promise<Result>
  settleHoldInvoice<Result = unknown>(params?: ElectrumNamedParams & { preimage?: unknown; walletPath?: unknown }): Promise<Result>
  cancelHoldInvoice<Result = unknown>(params?: ElectrumNamedParams & { paymentHash?: unknown; walletPath?: unknown }): Promise<Result>
  checkHoldInvoice<Result = unknown>(params?: ElectrumNamedParams & { paymentHash?: unknown; walletPath?: unknown }): Promise<Result>
  exportLightningPreimage<Result = unknown>(params?: ElectrumNamedParams & { paymentHash?: unknown; walletPath?: unknown }): Promise<Result>
  addTransaction<Result = unknown>(params?: ElectrumNamedParams & { tx?: unknown; walletPath?: unknown }): Promise<Result>
  deleteRequest<Result = unknown>(params?: ElectrumNamedParams & { requestId?: unknown; walletPath?: unknown }): Promise<Result>
  deleteInvoice<Result = unknown>(params?: ElectrumNamedParams & { invoiceId?: unknown; walletPath?: unknown }): Promise<Result>
  clearRequests<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }): Promise<Result>
  clearInvoices<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }): Promise<Result>
  notify<Result = unknown>(params?: ElectrumNamedParams & { address?: unknown; url?: unknown }): Promise<Result>
  isSynchronized<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }): Promise<Result>
  waitForSync<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }): Promise<Result>
  getFeeRate<Result = unknown>(params?: ElectrumNamedParams): Promise<Result>
  testInjectFeeEtas<Result = unknown>(params?: ElectrumNamedParams & { feeEst?: unknown }): Promise<Result>
  removeLocalTx<Result = unknown>(params?: ElectrumNamedParams & { txid?: unknown; walletPath?: unknown }): Promise<Result>
  getTxStatus<Result = unknown>(params?: ElectrumNamedParams & { txid?: unknown; walletPath?: unknown }): Promise<Result>
  help<Result = unknown>(params?: ElectrumNamedParams): Promise<Result>
  addPeer<Result = unknown>(params?: ElectrumNamedParams & { connectionString?: unknown; timeout?: unknown; gossip?: unknown; walletPath?: unknown }): Promise<Result>
  gossipInfo<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }): Promise<Result>
  listPeers<Result = unknown>(params?: ElectrumNamedParams & { gossip?: unknown; walletPath?: unknown }): Promise<Result>
  openChannel<Result = unknown>(params?: ElectrumNamedParams & { connectionString?: unknown; amount?: unknown; pushAmount?: unknown; public?: unknown; zeroconf?: unknown; password?: unknown; walletPath?: unknown }): Promise<Result>
  decodeInvoice<Result = unknown>(params?: ElectrumNamedParams & { invoice?: unknown }): Promise<Result>
  lnPay<Result = unknown>(params?: ElectrumNamedParams & { invoice?: unknown; timeout?: unknown; maxCltv?: unknown; maxFeeMsat?: unknown; password?: unknown; walletPath?: unknown }): Promise<Result>
  nodeId<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }): Promise<Result>
  listChannels<Result = unknown>(params?: ElectrumNamedParams & { public?: unknown; private?: unknown; active?: unknown; open?: unknown; walletPath?: unknown }): Promise<Result>
  listChannelBackups<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }): Promise<Result>
  enableHtlcSettle<Result = unknown>(params?: ElectrumNamedParams & { b?: unknown; walletPath?: unknown }): Promise<Result>
  clearLnBlacklist<Result = unknown>(params?: ElectrumNamedParams): Promise<Result>
  resetLiquidityHints<Result = unknown>(params?: ElectrumNamedParams): Promise<Result>
  closeChannel<Result = unknown>(params?: ElectrumNamedParams & { channelPoint?: unknown; force?: unknown; password?: unknown; walletPath?: unknown }): Promise<Result>
  deleteChannel<Result = unknown>(params?: ElectrumNamedParams & { channelPoint?: unknown; password?: unknown; walletPath?: unknown }): Promise<Result>
  deleteChannelBackup<Result = unknown>(params?: ElectrumNamedParams & { channelPoint?: unknown; password?: unknown; walletPath?: unknown }): Promise<Result>
  requestForceClose<Result = unknown>(params?: ElectrumNamedParams & { channelPoint?: unknown; connectionString?: unknown; password?: unknown; walletPath?: unknown }): Promise<Result>
  exportChannelBackup<Result = unknown>(params?: ElectrumNamedParams & { channelPoint?: unknown; password?: unknown; walletPath?: unknown }): Promise<Result>
  importChannelBackup<Result = unknown>(params?: ElectrumNamedParams & { encrypted?: unknown; walletPath?: unknown }): Promise<Result>
  getChannelCtx<Result = unknown>(params?: ElectrumNamedParams & { channelPoint?: unknown; password?: unknown; iKnowWhatImDoing?: unknown; walletPath?: unknown }): Promise<Result>
  listChannelHtlcs<Result = unknown>(params?: ElectrumNamedParams & { channelPoint?: unknown; password?: unknown; walletPath?: unknown }): Promise<Result>
  getWatchtowerCtn<Result = unknown>(params?: ElectrumNamedParams & { channelPoint?: unknown; walletPath?: unknown }): Promise<Result>
  rebalanceChannels<Result = unknown>(params?: ElectrumNamedParams & { fromScid?: unknown; destScid?: unknown; amount?: unknown; password?: unknown; walletPath?: unknown }): Promise<Result>
  getSubmarineSwapProviders<Result = unknown>(params?: ElectrumNamedParams & { queryTime?: unknown; walletPath?: unknown }): Promise<Result>
  normalSwap<Result = unknown>(params?: ElectrumNamedParams & { onchainAmount?: unknown; lightningAmount?: unknown; password?: unknown; walletPath?: unknown }): Promise<Result>
  reverseSwap<Result = unknown>(params?: ElectrumNamedParams & { lightningAmount?: unknown; onchainAmount?: unknown; prepayment?: unknown; password?: unknown; walletPath?: unknown }): Promise<Result>
  convertCurrency<Result = unknown>(params?: ElectrumNamedParams & { fromAmount?: unknown; fromCcy?: unknown; toCcy?: unknown }): Promise<Result>
  sendOnionMessage<Result = unknown>(params?: ElectrumNamedParams & { nodeIdOrBlindedPathHex?: unknown; message?: unknown; walletPath?: unknown }): Promise<Result>
  getBlindedPathVia<Result = unknown>(params?: ElectrumNamedParams & { nodeId?: unknown; dummyHops?: unknown; walletPath?: unknown }): Promise<Result>
  ping<Result = unknown>(params?: ElectrumNamedParams): Promise<Result>
  gui<Result = unknown>(params?: ElectrumNamedParams & { configOptions?: unknown }): Promise<Result>
  runCmdline<Result = unknown>(params?: ElectrumNamedParams & { configOptions?: unknown }): Promise<Result>
  history<Result = unknown>(params?: ElectrumNamedParams & { year?: unknown; showAddresses?: unknown; showFiat?: unknown; walletPath?: unknown }): Promise<Result>
}

export class ElectrumError extends Error {
  constructor(message?: string, options?: ErrorOptions)
}
export class ElectrumTransportError extends ElectrumError {}
export class ElectrumTimeoutError extends ElectrumTransportError {}
export class ElectrumHttpError extends ElectrumTransportError {
  constructor(method: string, response: { status: number; statusText: string }, body: string)
  method: string
  status: number
  statusText: string
  body: string
}
export class ElectrumResponseError extends ElectrumTransportError {}
export class ElectrumRpcError extends ElectrumError {
  constructor(method: string, response: ElectrumRpcErrorResponse)
  method: string
  code: number
  data: unknown
  rpcError: ElectrumRpcErrorDetails
  response: ElectrumRpcErrorResponse
}
