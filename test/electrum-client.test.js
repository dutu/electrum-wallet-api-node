import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { inspect } from 'node:util'
import test from 'node:test'
import {
  ElectrumClient,
  ElectrumError,
  ElectrumTransportError,
  ElectrumTimeoutError,
  ElectrumHttpError,
  ElectrumResponseError,
  ElectrumRpcError
} from 'electrum-wallet-api-node'

const credentials = { url: 'http://127.0.0.1:7777/', username: 'rpc-user', password: 'rpc-password' }

const mockRpc = function mockRpc(context, reply = () => ({ result: {} })) {
  const calls = []
  context.mock.method(globalThis, 'fetch', async (url, options) => {
    const request = JSON.parse(options.body)
    calls.push({ url, options, request })
    const value = await reply(request, options)
    return value instanceof Response ? value : Response.json({ jsonrpc: '2.0', id: request.id, ...value })
  })
  return calls
}

test('construction makes no request and exports only the client and errors', async (context) => {
  const calls = mockRpc(context)
  const client = new ElectrumClient(credentials)
  assert.equal(calls.length, 0)
  assert.equal(client.wallet, undefined)
  assert.equal(client.transport, undefined)
  assert.equal(client.authorization, undefined)
  const exports = await import('electrum-wallet-api-node')
  assert.deepEqual(Object.keys(exports).sort(), [
    'ElectrumClient', 'ElectrumError', 'ElectrumHttpError', 'ElectrumResponseError',
    'ElectrumRpcError', 'ElectrumTimeoutError', 'ElectrumTransportError'
  ])
})

for (const options of [undefined, null, [], 5, '', true]) {
  test(`rejects constructor options ${JSON.stringify(options)}`, () => {
    assert.throws(() => new ElectrumClient(options), TypeError)
  })
}

for (const [name, value] of [
  ['url', undefined], ['url', null], ['url', ''], ['url', 'not a URL'],
  ['url', 'file:///tmp/rpc'], ['url', 'http://user:secret@localhost/'],
  ['url', 'http://localhost/?secret=value'], ['url', 'http://localhost/#fragment'],
  ['url', 'http://localhost:65536/'],
  ['username', undefined], ['username', null], ['username', ''], ['username', '   '],
  ['username', 1], ['username', 'user:name'],
  ['password', undefined], ['password', null], ['password', ''], ['password', 1],
  ['timeout', 0], ['timeout', -1], ['timeout', 1.5], ['timeout', NaN],
  ['timeout', Infinity], ['timeout', '30000'], ['timeout', null], ['timeout', 2147483648]
]) {
  test(`rejects ${name}=${String(value)}`, () => {
    assert.throws(() => new ElectrumClient({ ...credentials, [name]: value }), TypeError)
  })
}

test('HTTP authentication and JSON-RPC format follow the reference conventions', async (context) => {
  const calls = mockRpc(context, () => ({ result: true }))
  const options = { ...credentials, username: 'é-user', password: 'päss:word' }
  const client = new ElectrumClient(options)
  options.url = 'http://localhost:9999/'
  options.password = 'changed'
  assert.equal(await client.ping(), true)
  const [{ url, request, options: sent }] = calls
  assert.equal(url, credentials.url)
  assert.equal(sent.method, 'POST')
  assert.equal(sent.redirect, 'manual')
  assert.equal(sent.headers['Content-Type'], 'application/json')
  assert.equal(sent.headers.Accept, 'application/json')
  assert.equal(sent.headers.Authorization, `Basic ${Buffer.from('é-user:päss:word', 'utf8').toString('base64')}`)
  assert.ok(sent.signal instanceof AbortSignal)
  assert.deepEqual(Object.keys(request).sort(), ['id', 'jsonrpc', 'method', 'params'])
  assert.equal(request.jsonrpc, '2.0')
  assert.equal(request.method, 'ping')
  assert.deepEqual(request.params, {})
  assert.match(request.id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u)
})

test('preserves HTTPS reverse-proxy endpoint paths', async (context) => {
  const calls = mockRpc(context)
  await new ElectrumClient({ ...credentials, url: 'https://rpc.example.test/electrum' }).getInfo()
  assert.equal(calls[0].url, 'https://rpc.example.test/electrum')
})

test('request IDs are unique across clients and concurrent requests', async (context) => {
  const calls = mockRpc(context)
  const client = new ElectrumClient(credentials)
  await Promise.all([
    client.getInfo(), client.getBalance(), client.request('future_rpc'),
    new ElectrumClient(credentials).getInfo()
  ])
  assert.equal(new Set(calls.map(({ request }) => request.id)).size, 4)
})

test('generic request forwards method and original named parameter names', async (context) => {
  const result = { confirmed: '123456789.12345678', future_field: [null, false, 0, '1.00000001'] }
  const calls = mockRpc(context, () => ({ result }))
  const params = { wallet_path: '/wallet', feeRate: '2.123456789', future_field: { from_coins: 'x', omit: undefined } }
  assert.deepEqual(await new ElectrumClient(credentials).request('future_RPC', params), result)
  assert.equal(calls[0].request.method, 'future_RPC')
  assert.deepEqual(calls[0].request.params, {
    wallet_path: '/wallet', feeRate: '2.123456789', future_field: { from_coins: 'x' }
  })
})

test('generic request supports positional params and does not inject defaults', async (context) => {
  const calls = mockRpc(context)
  const client = new ElectrumClient(credentials)
  await client.request('getconfig', ['fee_policy'])
  await client.request('getinfo')
  await client.request('getinfo', undefined)
  await client.request('future', { omitted: undefined, zero: 0, no: false, empty: '', nil: null })
  assert.deepEqual(calls.map(({ request }) => request.params), [
    ['fee_policy'], {}, {}, { zero: 0, no: false, empty: '', nil: null }
  ])
})

test('snapshots request values without mutating the caller', async (context) => {
  const calls = mockRpc(context)
  const params = { outputs: [['destination', '0.12345678']], feeRate: '2', walletPath: '/wallet', absent: undefined }
  const pending = new ElectrumClient(credentials).payToMany(params)
  params.outputs[0][1] = '9'
  params.walletPath = '/different'
  await pending
  assert.deepEqual(calls[0].request.params, {
    outputs: [['destination', '0.12345678']], feerate: '2', wallet_path: '/wallet'
  })
  assert.equal(params.feeRate, '2')
  assert.ok(Object.hasOwn(params, 'absent'))
})

test('payTo forwards exact amount strings and coin/change options', async (context) => {
  const calls = mockRpc(context, () => ({ result: 'serialized-transaction' }))
  const txid = 'a'.repeat(64)
  const result = await new ElectrumClient(credentials).payTo({
    destination: 'destination', amount: '0.10000001', fee: undefined, feeRate: '2.123456789',
    fromAddr: 'source1,source2', fromCoins: `${txid}:0,${txid}:1`, changeAddr: 'change',
    unsigned: false, rbf: false, password: 'wallet-secret', locktime: 100,
    addTransaction: true, walletPath: '/wallet', future_option: { feeRate: 'unchanged' }
  })
  assert.equal(result, 'serialized-transaction')
  assert.equal(calls[0].request.method, 'payto')
  assert.deepEqual(calls[0].request.params, {
    destination: 'destination', amount: '0.10000001', feerate: '2.123456789',
    from_addr: 'source1,source2', from_coins: `${txid}:0,${txid}:1`, change_addr: 'change',
    unsigned: false, rbf: false, password: 'wallet-secret', locktime: 100,
    addtransaction: true, wallet_path: '/wallet', future_option: { feeRate: 'unchanged' }
  })
})

test('payToMany preserves output pairs and maps the same spending options', async (context) => {
  const calls = mockRpc(context)
  await new ElectrumClient(credentials).payToMany({
    outputs: [['address1', '0.01000001'], ['address2', '!']],
    fromCoins: 'outpoint:0', changeAddr: 'change', feeRate: '1.25', unsigned: true
  })
  assert.equal(calls[0].request.method, 'paytomany')
  assert.deepEqual(calls[0].request.params, {
    outputs: [['address1', '0.01000001'], ['address2', '!']],
    from_coins: 'outpoint:0', change_addr: 'change', feerate: '1.25', unsigned: true
  })
})

for (const [name, rpc, params, expected] of [
  ['getBalance', 'getbalance', { walletPath: '/wallet' }, { wallet_path: '/wallet' }],
  ['listUnspent', 'listunspent', { walletPath: '/wallet' }, { wallet_path: '/wallet' }],
  ['getTransaction', 'gettransaction', { txid: 'txid', walletPath: '/wallet' }, { txid: 'txid', wallet_path: '/wallet' }],
  ['signTransaction', 'signtransaction', { tx: 'psbt', password: 'wallet-secret', ignoreWarnings: true, walletPath: '/wallet' },
    { tx: 'psbt', password: 'wallet-secret', ignore_warnings: true, wallet_path: '/wallet' }],
  ['broadcast', 'broadcast', { tx: 'signed-transaction' }, { tx: 'signed-transaction' }],
  ['history', 'history', { year: 2026, showAddresses: true, showFiat: false, walletPath: '/wallet' },
    { year: 2026, show_addresses: true, show_fiat: false, wallet_path: '/wallet' }]
]) {
  test(`${name} maps directly to ${rpc} and returns the result`, async (context) => {
    const result = { value: '0.00000001', extras: { untouched: true } }
    const calls = mockRpc(context, () => ({ result }))
    assert.deepEqual(await new ElectrumClient(credentials)[name](params), result)
    assert.equal(calls[0].request.method, rpc)
    assert.deepEqual(calls[0].request.params, expected)
  })
}

test('raw RPC names are accepted by named wrappers', async (context) => {
  const calls = mockRpc(context)
  await new ElectrumClient(credentials).payTo({ destination: 'x', amount: '!', from_coins: 'tx:0', change_addr: 'y', feerate: '2' })
  assert.deepEqual(calls[0].request.params, { destination: 'x', amount: '!', from_coins: 'tx:0', change_addr: 'y', feerate: '2' })
})

test('only omitted values are removed, and aliases cannot silently overwrite each other', async (context) => {
  const calls = mockRpc(context)
  const client = new ElectrumClient(credentials)
  await client.payTo({ feeRate: undefined, feerate: null, fromCoins: '', unsigned: false, locktime: 0 })
  assert.deepEqual(calls[0].request.params, { feerate: null, from_coins: '', unsigned: false, locktime: 0 })
  assert.throws(() => client.payTo({ feeRate: '1', feerate: '2' }), TypeError)
  assert.equal(calls.length, 1)
})

test('Electrum validates required arguments and parameter values', async (context) => {
  const calls = mockRpc(context, () => ({ error: { code: -32602, message: 'Invalid parameters' } }))
  await assert.rejects(new ElectrumClient(credentials).payTo({ amount: 'nonsense', fromCoins: [] }), ElectrumRpcError)
  assert.deepEqual(calls[0].request.params, { amount: 'nonsense', from_coins: [] })
})

for (const result of [null, false, 0, '', [], {}, '0.00000001']) {
  test(`returns result ${JSON.stringify(result)} without an envelope`, async (context) => {
    mockRpc(context, () => ({ result, additional_envelope_field: 'ignored' }))
    assert.deepEqual(await new ElectrumClient(credentials).getInfo(), result)
  })
}

test('JSON-RPC errors preserve original code, message, data and extra fields', async (context) => {
  const rpcError = { code: -32603, message: 'Wallet not loaded', data: { exception: 'exception', traceback: 'trace' }, extra: 123 }
  const calls = mockRpc(context, () => ({ error: rpcError, server_extra: true }))
  await assert.rejects(new ElectrumClient(credentials).getBalance(), (error) => {
    assert.ok(error instanceof ElectrumError)
    assert.ok(error instanceof ElectrumRpcError)
    assert.equal(error.name, 'ElectrumRpcError')
    assert.equal(error.method, 'getbalance')
    assert.equal(error.code, rpcError.code)
    assert.equal(error.message, rpcError.message)
    assert.deepEqual(error.data, rpcError.data)
    assert.deepEqual(error.rpcError, rpcError)
    assert.deepEqual(error.response, { jsonrpc: '2.0', id: calls[0].request.id, error: rpcError, server_extra: true })
    return true
  })
})

for (const status of [301, 401, 403, 404, 500, 503]) {
  test(`HTTP ${status} takes precedence over JSON parsing`, async (context) => {
    mockRpc(context, () => new Response('HTTP failure', { status, statusText: 'Failure' }))
    await assert.rejects(new ElectrumClient(credentials).getInfo(), (error) => {
      assert.ok(error instanceof ElectrumHttpError)
      assert.ok(error instanceof ElectrumTransportError)
      assert.equal(error.status, status)
      assert.equal(error.statusText, 'Failure')
      assert.equal(error.body, 'HTTP failure')
      assert.equal(error.method, 'getinfo')
      return true
    })
  })
}

for (const body of ['', '<html>Not JSON</html>', '{"jsonrpc":']) {
  test(`invalid JSON ${JSON.stringify(body)} is a response error`, async (context) => {
    mockRpc(context, () => new Response(body))
    await assert.rejects(new ElectrumClient(credentials).getInfo(), (error) => {
      assert.ok(error instanceof ElectrumResponseError)
      assert.equal(error.cause.name, 'SyntaxError')
      return true
    })
  })
}

for (const [name, reply] of [
  ['null', () => null], ['primitive', () => 1], ['batch', () => []],
  ['wrong version', (r) => ({ jsonrpc: '1.0', id: r.id, result: {} })],
  ['missing version', (r) => ({ id: r.id, result: {} })],
  ['wrong ID', () => ({ jsonrpc: '2.0', id: 'wrong', result: {} })],
  ['missing ID', () => ({ jsonrpc: '2.0', result: {} })],
  ['missing result', (r) => ({ jsonrpc: '2.0', id: r.id })],
  ['null error', (r) => ({ jsonrpc: '2.0', id: r.id, error: null })],
  ['invalid code', (r) => ({ jsonrpc: '2.0', id: r.id, error: { code: 'bad', message: 'error' } })],
  ['missing message', (r) => ({ jsonrpc: '2.0', id: r.id, error: { code: -32603 } })],
  ['result and error', (r) => ({ jsonrpc: '2.0', id: r.id, result: null, error: { code: -32603, message: 'error' } })]
]) {
  test(`rejects malformed envelope: ${name}`, async (context) => {
    mockRpc(context, (request) => Response.json(reply(request)))
    await assert.rejects(new ElectrumClient(credentials).getInfo(), ElectrumResponseError)
  })
}

test('network failures retain sanitized cause details', async (context) => {
  const cause = new Error('connection refused', { cause: Object.assign(new Error('socket failed'), { code: 'ECONNREFUSED' }) })
  mockRpc(context, () => { throw cause })
  await assert.rejects(new ElectrumClient(credentials).getInfo(), (error) => {
    assert.ok(error instanceof ElectrumTransportError)
    assert.equal(error.cause.message, 'connection refused')
    assert.equal(error.cause.cause.code, 'ECONNREFUSED')
    return true
  })
})

test('response body read failures are transport errors', async (context) => {
  mockRpc(context, () => new Response(new ReadableStream({
    start(controller) { controller.error(new Error('Connection closed')) }
  })))
  await assert.rejects(new ElectrumClient(credentials).getInfo(), ElectrumTransportError)
})

test('a failed request does not prevent subsequent requests', async (context) => {
  mockRpc(context, (request) => request.method === 'getbalance'
    ? { error: { code: -32603, message: 'Missing wallet' } } : { result: true })
  const client = new ElectrumClient(credentials)
  await assert.rejects(client.getBalance(), ElectrumRpcError)
  assert.equal(await client.ping(), true)
})

for (const method of [undefined, null, '', '   ', 1, {}, []]) {
  test(`generic request rejects method ${JSON.stringify(method)}`, async (context) => {
    const calls = mockRpc(context)
    await assert.rejects(new ElectrumClient(credentials).request(method), TypeError)
    assert.equal(calls.length, 0)
  })
}

for (const params of [null, 1, false, 'params']) {
  test(`rejects non-container params ${JSON.stringify(params)}`, async (context) => {
    const calls = mockRpc(context)
    const client = new ElectrumClient(credentials)
    await assert.rejects(client.request('future', params), TypeError)
    assert.throws(() => client.getBalance(params), TypeError)
    assert.equal(calls.length, 0)
  })
}

test('rejects unserializable params and never converts undefined array entries to null', async (context) => {
  const calls = mockRpc(context)
  const circular = {}
  circular.self = circular
  const client = new ElectrumClient(credentials)
  for (const params of [circular, { amount: 1n }, [undefined], Array(1), { outputs: [['address', undefined]] }]) {
    await assert.rejects(client.request('future', params), TypeError)
  }
  assert.equal(calls.length, 0)
  await client.getInfo()
  assert.equal(calls.length, 1)
})

test('errors redact authentication and wallet passwords in messages and diagnostics', async (context) => {
  const secret = 'secret.*[$]\\password'
  const settings = { ...credentials, username: 'private-user', password: secret }
  const encoded = Buffer.from(`${settings.username}:${secret}`).toString('base64')
  const walletSecret = 'wallet-password-secret'
  const echoes = `${settings.username} ${secret} ${encoded} ${walletSecret}`
  const replies = [
    () => ({ error: { code: -32603, message: echoes, data: { traceback: echoes, nested: [echoes] } } }),
    () => new Response(echoes, { status: 403, statusText: settings.username }),
    () => { throw new Error(echoes, { cause: new Error(echoes) }) },
    () => new Response(`not JSON: ${echoes}`)
  ]
  for (const reply of replies) {
    mockRpc(context, reply)
    await assert.rejects(new ElectrumClient(settings).signTransaction({ tx: 'tx', password: walletSecret }), (error) => {
      const diagnostic = inspect(error, { depth: null })
      for (const value of [settings.username, secret, encoded, walletSecret]) assert.ok(!diagnostic.includes(value))
      return true
    })
  }
  assert.throws(() => new ElectrumClient({ ...settings, url: `http://${secret}` }), (error) => {
    assert.ok(!inspect(error).includes(secret))
    return true
  })
})

test('dangerous object keys remain parameters rather than prototype mutations', async (context) => {
  const calls = mockRpc(context)
  await new ElectrumClient(credentials).payTo(JSON.parse('{"__proto__":{"polluted":true},"constructor":7,"feeRate":"2"}'))
  assert.deepEqual(calls[0].request.params, JSON.parse('{"__proto__":{"polluted":true},"constructor":7,"feerate":"2"}'))
  assert.equal({}.polluted, undefined)
})
