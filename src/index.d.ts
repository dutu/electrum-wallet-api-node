/** Connection options use HTTP Basic Authentication. */
export interface ElectrumClientOptions {
  url: string
  username: string
  password: string
  /** Integer milliseconds between 1 and 2147483647; defaults to 30000. */
  timeout?: number | undefined
}

/** Local configuration, never sent to Electrum. */
export interface ElectrumRequestOptions {
  /** Integer milliseconds between 1 and 2147483647; defaults to the client's timeout. */
  timeout?: number | undefined
  /** Cancels waiting for the response; does not guarantee the RPC stopped executing. */
  signal?: AbortSignal | undefined
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
  request<Result = unknown>(method: string, params?: ElectrumRpcParams, options?: ElectrumRequestOptions): Promise<Result>
  getInfo<Result = unknown>(params?: ElectrumNamedParams, options?: ElectrumRequestOptions): Promise<Result>
  stop<Result = unknown>(params?: ElectrumNamedParams, options?: ElectrumRequestOptions): Promise<Result>
  listWallets<Result = unknown>(params?: ElectrumNamedParams, options?: ElectrumRequestOptions): Promise<Result>
  loadWallet<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown; password?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  closeWallet<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  create<Result = unknown>(params?: ElectrumNamedParams & { passphrase?: unknown; password?: unknown; encryptFile?: unknown; seedType?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  restore<Result = unknown>(params?: ElectrumNamedParams & { text?: unknown; passphrase?: unknown; password?: unknown; encryptFile?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  password<Result = unknown>(params?: ElectrumNamedParams & { password?: unknown; newPassword?: unknown; encryptFile?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  get<Result = unknown>(params?: ElectrumNamedParams & { key?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  getConfig<Result = unknown>(params?: ElectrumNamedParams & { key?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  setConfig<Result = unknown>(params?: ElectrumNamedParams & { key?: unknown; value?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  unsetConfig<Result = unknown>(params?: ElectrumNamedParams & { key?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  listConfig<Result = unknown>(params?: ElectrumNamedParams, options?: ElectrumRequestOptions): Promise<Result>
  helpConfig<Result = unknown>(params?: ElectrumNamedParams & { key?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  makeSeed<Result = unknown>(params?: ElectrumNamedParams & { nbits?: unknown; language?: unknown; seedType?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  getAddressHistory<Result = unknown>(params?: ElectrumNamedParams & { address?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  unlock<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown; password?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  listUnspent<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  getAddressUnspent<Result = unknown>(params?: ElectrumNamedParams & { address?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  serialize<Result = unknown>(params?: ElectrumNamedParams & { jsonTx?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  signTransactionWithPrivkey<Result = unknown>(params?: ElectrumNamedParams & { tx?: unknown; privkey?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  signTransaction<Result = unknown>(params?: ElectrumNamedParams & { tx?: unknown; password?: unknown; walletPath?: unknown; ignoreWarnings?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  deserialize<Result = unknown>(params?: ElectrumNamedParams & { tx?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  broadcast<Result = unknown>(params?: ElectrumNamedParams & { tx?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  createMultisig<Result = unknown>(params?: ElectrumNamedParams & { num?: unknown; pubkeys?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  freeze<Result = unknown>(params?: ElectrumNamedParams & { address?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  unfreeze<Result = unknown>(params?: ElectrumNamedParams & { address?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  freezeUtxo<Result = unknown>(params?: ElectrumNamedParams & { coin?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  unfreezeUtxo<Result = unknown>(params?: ElectrumNamedParams & { coin?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  getPrivateKeys<Result = unknown>(params?: ElectrumNamedParams & { address?: unknown; password?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  getPrivateKeyForPath<Result = unknown>(params?: ElectrumNamedParams & { path?: unknown; password?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  isMine<Result = unknown>(params?: ElectrumNamedParams & { address?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  dumpPrivKeys<Result = unknown>(params?: ElectrumNamedParams, options?: ElectrumRequestOptions): Promise<Result>
  validateAddress<Result = unknown>(params?: ElectrumNamedParams & { address?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  getPubKeys<Result = unknown>(params?: ElectrumNamedParams & { address?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  getBalance<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  getAddressBalance<Result = unknown>(params?: ElectrumNamedParams & { address?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  getMerkle<Result = unknown>(params?: ElectrumNamedParams & { txid?: unknown; height?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  getServers<Result = unknown>(params?: ElectrumNamedParams, options?: ElectrumRequestOptions): Promise<Result>
  version<Result = unknown>(params?: ElectrumNamedParams, options?: ElectrumRequestOptions): Promise<Result>
  versionInfo<Result = unknown>(params?: ElectrumNamedParams, options?: ElectrumRequestOptions): Promise<Result>
  getMpk<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  getMasterPrivate<Result = unknown>(params?: ElectrumNamedParams & { password?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  convertXkey<Result = unknown>(params?: ElectrumNamedParams & { xkey?: unknown; xtype?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  getSeed<Result = unknown>(params?: ElectrumNamedParams & { password?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  importPrivkey<Result = unknown>(params?: ElectrumNamedParams & { privkey?: unknown; password?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  sweep<Result = unknown>(params?: ElectrumNamedParams & { privkey?: unknown; destination?: unknown; fee?: unknown; feeRate?: unknown; imax?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  signMessage<Result = unknown>(params?: ElectrumNamedParams & { address?: unknown; message?: unknown; password?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  verifyMessage<Result = unknown>(params?: ElectrumNamedParams & { address?: unknown; signature?: unknown; message?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  payTo<Result = unknown>(params?: ElectrumNamedParams & { destination?: unknown; amount?: unknown; fee?: unknown; feeRate?: unknown; fromAddr?: unknown; fromCoins?: unknown; changeAddr?: unknown; unsigned?: unknown; rbf?: unknown; password?: unknown; locktime?: unknown; addTransaction?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  payToMany<Result = unknown>(params?: ElectrumNamedParams & { outputs?: unknown; fee?: unknown; feeRate?: unknown; fromAddr?: unknown; fromCoins?: unknown; changeAddr?: unknown; unsigned?: unknown; rbf?: unknown; password?: unknown; locktime?: unknown; addTransaction?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  onchainCapitalGains<Result = unknown>(params?: ElectrumNamedParams & { year?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  bumpFee<Result = unknown>(params?: ElectrumNamedParams & { tx?: unknown; newFeeRate?: unknown; fromCoins?: unknown; decreasePayment?: unknown; password?: unknown; unsigned?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  dsCancel<Result = unknown>(params?: ElectrumNamedParams & { tx?: unknown; newFeeRate?: unknown; password?: unknown; unsigned?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  onchainHistory<Result = unknown>(params?: ElectrumNamedParams & { showFiat?: unknown; year?: unknown; showAddresses?: unknown; fromHeight?: unknown; toHeight?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  lightningHistory<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  setLabel<Result = unknown>(params?: ElectrumNamedParams & { key?: unknown; label?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  listContacts<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  getOpenAlias<Result = unknown>(params?: ElectrumNamedParams & { key?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  searchContacts<Result = unknown>(params?: ElectrumNamedParams & { query?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  listAddresses<Result = unknown>(params?: ElectrumNamedParams & { receiving?: unknown; change?: unknown; labels?: unknown; frozen?: unknown; unused?: unknown; funded?: unknown; balance?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  getTransaction<Result = unknown>(params?: ElectrumNamedParams & { txid?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  encrypt<Result = unknown>(params?: ElectrumNamedParams & { pubkey?: unknown; message?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  decrypt<Result = unknown>(params?: ElectrumNamedParams & { pubkey?: unknown; encrypted?: unknown; password?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  getRequest<Result = unknown>(params?: ElectrumNamedParams & { requestId?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  getInvoice<Result = unknown>(params?: ElectrumNamedParams & { invoiceId?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  listRequests<Result = unknown>(params?: ElectrumNamedParams & { pending?: unknown; expired?: unknown; paid?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  listInvoices<Result = unknown>(params?: ElectrumNamedParams & { pending?: unknown; expired?: unknown; paid?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  createNewAddress<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  changeGapLimit<Result = unknown>(params?: ElectrumNamedParams & { newLimit?: unknown; iKnowWhatImDoing?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  getMinAcceptableGap<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  getUnusedAddress<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  addRequest<Result = unknown>(params?: ElectrumNamedParams & { amount?: unknown; memo?: unknown; expiry?: unknown; lightning?: unknown; force?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  addHoldInvoice<Result = unknown>(params?: ElectrumNamedParams & { paymentHash?: unknown; amount?: unknown; memo?: unknown; expiry?: unknown; minFinalCltvExpiryDelta?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  settleHoldInvoice<Result = unknown>(params?: ElectrumNamedParams & { preimage?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  cancelHoldInvoice<Result = unknown>(params?: ElectrumNamedParams & { paymentHash?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  checkHoldInvoice<Result = unknown>(params?: ElectrumNamedParams & { paymentHash?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  exportLightningPreimage<Result = unknown>(params?: ElectrumNamedParams & { paymentHash?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  addTransaction<Result = unknown>(params?: ElectrumNamedParams & { tx?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  deleteRequest<Result = unknown>(params?: ElectrumNamedParams & { requestId?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  deleteInvoice<Result = unknown>(params?: ElectrumNamedParams & { invoiceId?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  clearRequests<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  clearInvoices<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  notify<Result = unknown>(params?: ElectrumNamedParams & { address?: unknown; url?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  isSynchronized<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  waitForSync<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  getFeeRate<Result = unknown>(params?: ElectrumNamedParams, options?: ElectrumRequestOptions): Promise<Result>
  testInjectFeeEtas<Result = unknown>(params?: ElectrumNamedParams & { feeEst?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  removeLocalTx<Result = unknown>(params?: ElectrumNamedParams & { txid?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  getTxStatus<Result = unknown>(params?: ElectrumNamedParams & { txid?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  help<Result = unknown>(params?: ElectrumNamedParams, options?: ElectrumRequestOptions): Promise<Result>
  addPeer<Result = unknown>(params?: ElectrumNamedParams & { connectionString?: unknown; timeout?: unknown; gossip?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  gossipInfo<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  listPeers<Result = unknown>(params?: ElectrumNamedParams & { gossip?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  openChannel<Result = unknown>(params?: ElectrumNamedParams & { connectionString?: unknown; amount?: unknown; pushAmount?: unknown; public?: unknown; zeroconf?: unknown; password?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  decodeInvoice<Result = unknown>(params?: ElectrumNamedParams & { invoice?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  lnPay<Result = unknown>(params?: ElectrumNamedParams & { invoice?: unknown; timeout?: unknown; maxCltv?: unknown; maxFeeMsat?: unknown; password?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  nodeId<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  listChannels<Result = unknown>(params?: ElectrumNamedParams & { public?: unknown; private?: unknown; active?: unknown; open?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  listChannelBackups<Result = unknown>(params?: ElectrumNamedParams & { walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  enableHtlcSettle<Result = unknown>(params?: ElectrumNamedParams & { b?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  clearLnBlacklist<Result = unknown>(params?: ElectrumNamedParams, options?: ElectrumRequestOptions): Promise<Result>
  resetLiquidityHints<Result = unknown>(params?: ElectrumNamedParams, options?: ElectrumRequestOptions): Promise<Result>
  closeChannel<Result = unknown>(params?: ElectrumNamedParams & { channelPoint?: unknown; force?: unknown; password?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  deleteChannel<Result = unknown>(params?: ElectrumNamedParams & { channelPoint?: unknown; password?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  deleteChannelBackup<Result = unknown>(params?: ElectrumNamedParams & { channelPoint?: unknown; password?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  requestForceClose<Result = unknown>(params?: ElectrumNamedParams & { channelPoint?: unknown; connectionString?: unknown; password?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  exportChannelBackup<Result = unknown>(params?: ElectrumNamedParams & { channelPoint?: unknown; password?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  importChannelBackup<Result = unknown>(params?: ElectrumNamedParams & { encrypted?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  getChannelCtx<Result = unknown>(params?: ElectrumNamedParams & { channelPoint?: unknown; password?: unknown; iKnowWhatImDoing?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  listChannelHtlcs<Result = unknown>(params?: ElectrumNamedParams & { channelPoint?: unknown; password?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  getWatchtowerCtn<Result = unknown>(params?: ElectrumNamedParams & { channelPoint?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  rebalanceChannels<Result = unknown>(params?: ElectrumNamedParams & { fromScid?: unknown; destScid?: unknown; amount?: unknown; password?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  getSubmarineSwapProviders<Result = unknown>(params?: ElectrumNamedParams & { queryTime?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  normalSwap<Result = unknown>(params?: ElectrumNamedParams & { onchainAmount?: unknown; lightningAmount?: unknown; password?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  reverseSwap<Result = unknown>(params?: ElectrumNamedParams & { lightningAmount?: unknown; onchainAmount?: unknown; prepayment?: unknown; password?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  convertCurrency<Result = unknown>(params?: ElectrumNamedParams & { fromAmount?: unknown; fromCcy?: unknown; toCcy?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  sendOnionMessage<Result = unknown>(params?: ElectrumNamedParams & { nodeIdOrBlindedPathHex?: unknown; message?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  getBlindedPathVia<Result = unknown>(params?: ElectrumNamedParams & { nodeId?: unknown; dummyHops?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  ping<Result = unknown>(params?: ElectrumNamedParams, options?: ElectrumRequestOptions): Promise<Result>
  gui<Result = unknown>(params?: ElectrumNamedParams & { configOptions?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  runCmdline<Result = unknown>(params?: ElectrumNamedParams & { configOptions?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
  history<Result = unknown>(params?: ElectrumNamedParams & { year?: unknown; showAddresses?: unknown; showFiat?: unknown; walletPath?: unknown }, options?: ElectrumRequestOptions): Promise<Result>
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
