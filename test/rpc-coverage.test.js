import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { ElectrumClient } from 'electrum-wallet-api-node'

// Names, signatures and requirement flags extracted from the pinned official Python source.
const snapshot = JSON.parse(await readFile(new URL('./fixtures/electrum-rpc.json', import.meta.url), 'utf8'))
const compoundAliases = {
  feerate: 'feeRate', addtransaction: 'addTransaction', iknowwhatimdoing: 'iKnowWhatImDoing', jsontx: 'jsonTx', URL: 'url'
}
const jsName = (rpcName) => compoundAliases[rpcName] ?? rpcName.replace(/_([a-z])/gu, (_, letter) => letter.toUpperCase())
const credentials = { url: 'http://127.0.0.1:7777', username: 'rpc-user', password: 'rpc-password' }

test('the named method inventory covers all 122 registered core endpoints plus legacy history', () => {
  assert.equal(snapshot.commands.length, 122)
  assert.equal(new Set(snapshot.commands.map(({ rpc }) => rpc)).size, 122)
  assert.equal(new Set(snapshot.commands.map(({ js }) => js)).size, 122)
  const methods = Object.getOwnPropertyNames(ElectrumClient.prototype)
    .filter((name) => !['constructor', 'request'].includes(name)).sort()
  assert.deepEqual(methods, [...snapshot.commands.map(({ js }) => js), 'history'].sort())
})

for (const command of snapshot.commands) {
  test(`${command.js} covers upstream ${command.rpc} with every parameter and no injected defaults`, async (context) => {
    const client = new ElectrumClient(credentials)
    const calls = []
    context.mock.method(client, 'request', async (method, params, options) => {
      calls.push({ method, params: JSON.parse(JSON.stringify(params)), options })
      return 'unchanged-result'
    })
    const params = Object.fromEntries(command.parameters.map(({ name }) => [jsName(name), `value-for-${name}`]))
    const options = Object.freeze({ timeout: 120000, signal: new AbortController().signal })
    assert.equal(await client[command.js](params, options), 'unchanged-result')
    assert.equal(calls[0].options, options)
    assert.deepEqual(calls[0], {
      method: command.rpc,
      params: Object.fromEntries(command.parameters.map(({ name }) => [name, `value-for-${name}`])),
      options
    })
    await client[command.js]()
    assert.deepEqual(calls[1], { method: command.rpc, params: {}, options: {} })

    const original = Object.fromEntries(command.parameters.map(({ name }) => [name, `raw-${name}`]))
    await client[command.js](original)
    assert.deepEqual(calls[2], { method: command.rpc, params: original, options: {} })

    await client[command.js](undefined, options)
    assert.deepEqual(calls[3], { method: command.rpc, params: {}, options })
  })
}

test('daemon configOptions are mapped only at the top level', async (context) => {
  const client = new ElectrumClient(credentials)
  const calls = []
  context.mock.method(client, 'request', async (method, params) => {
    calls.push({ method, params: JSON.parse(JSON.stringify(params)) })
  })
  const config = { cmd: 'getbalance', wallet_path: '/wallet', from_coins: 'tx:0' }
  await client.runCmdline({ configOptions: config })
  await client.gui({ configOptions: config })
  assert.deepEqual(calls, [
    { method: 'run_cmdline', params: { config_options: config } },
    { method: 'gui', params: { config_options: config } }
  ])
})
