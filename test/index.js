'use strict'

const test = require('ava')
const execa = require('execa')
const sinon = require('sinon')
const plugin = require('../src')

test('gitbook plugin structure', t => {
  t.deepEqual(Object.keys(plugin), ['website', 'filters', 'hooks'])
})

test('page hook work well', async t => {
  const page = {}
  const stub = sinon.stub(execa, 'shell')
  const ctx = {
    resolve: sinon.spy(),
    config: {
      get: sinon.spy(() => {
        return {
          'git-author': 'L3au'
        }
      })
    }
  }

  stub.resolves({
    stdout: 'L3au|1491304006\nL3au|1491294084'
  })

  await plugin.hooks.page.call(ctx, page)

  t.true(ctx.resolve.called)
  t.true(ctx.config.get.called)
})
