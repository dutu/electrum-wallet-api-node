import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { once } from 'node:events'
import { createServer } from 'node:http'
import test from 'node:test'
import { ElectrumClient, ElectrumHttpError, ElectrumTimeoutError } from 'electrum-wallet-api-node'

const credentials = { username: 'rpc-user', password: 'rpc-password' }

const rpcServer = async function rpcServer(context, handler) {
  const server = createServer((request, response) => {
    let body = ''
    request.setEncoding('utf8')
    request.on('data', (chunk) => { body += chunk })
    request.on('end', () => handler(request, response, JSON.parse(body)))
  })
  context.after(async () => {
    server.closeAllConnections()
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  return `http://127.0.0.1:${server.address().port}/`
}

test('native HTTP sends Basic auth and JSON-RPC POST requests', async (context) => {
  const calls = []
  const url = await rpcServer(context, (request, response, payload) => {
    calls.push({ method: request.method, path: request.url, headers: request.headers, payload })
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ jsonrpc: '2.0', id: payload.id, result: { confirmed: '0.12345678' } }))
  })
  const result = await new ElectrumClient({ ...credentials, url }).getBalance({ walletPath: '/wallet' })
  assert.deepEqual(result, { confirmed: '0.12345678' })
  assert.equal(calls[0].method, 'POST')
  assert.equal(calls[0].path, '/')
  assert.equal(calls[0].headers.authorization, `Basic ${Buffer.from('rpc-user:rpc-password').toString('base64')}`)
  assert.equal(calls[0].headers['content-type'], 'application/json')
  assert.deepEqual(calls[0].payload.params, { wallet_path: '/wallet' })
})

test('HTTP authentication failure is distinct from JSON-RPC failure', async (context) => {
  const url = await rpcServer(context, (_, response) => {
    response.writeHead(403)
    response.end('Forbidden')
  })
  await assert.rejects(new ElectrumClient({ ...credentials, url }).ping(), (error) => {
    assert.ok(error instanceof ElectrumHttpError)
    assert.equal(error.status, 403)
    return true
  })
})

for (const stage of ['headers', 'body']) {
  test(`timeout includes waiting for response ${stage}`, async (context) => {
    const url = await rpcServer(context, (_, response, payload) => {
      if (payload.method === 'ping') {
        response.end(JSON.stringify({ jsonrpc: '2.0', id: payload.id, result: true }))
      } else if (stage === 'body') {
        response.writeHead(200, { 'Content-Type': 'application/json' })
        response.flushHeaders()
        response.write('{"jsonrpc":"2.0",')
      }
    })
    const client = new ElectrumClient({ ...credentials, url, timeout: 200 })
    await assert.rejects(client.getInfo(), (error) => {
      assert.ok(error instanceof ElectrumTimeoutError)
      assert.equal(error.name, 'ElectrumTimeoutError')
      assert.match(error.message, /200 ms/u)
      return true
    })
    assert.equal(await client.ping(), true)
  })
}

test('HTTP redirects are reported without following them', async (context) => {
  let redirected = false
  const destination = await rpcServer(context, (_, response) => {
    redirected = true
    response.end('{}')
  })
  const url = await rpcServer(context, (_, response) => {
    response.writeHead(307, { Location: destination })
    response.end('Redirect')
  })
  await assert.rejects(new ElectrumClient({ ...credentials, url }).ping(), ElectrumHttpError)
  assert.equal(redirected, false)
})
