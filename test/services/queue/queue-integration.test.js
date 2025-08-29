import assert from 'assert'
import { app } from '../../src/app.js'

describe('queue integration', () => {
  let queueService
  let convertService

  beforeAll(() => {
    queueService = app.service('queue')
    convertService = app.service('convert')
  })

  it('should trigger queue message on conversion creation', async () => {
    const originalSend = queueService.sendToQueue
    let queueCallCount = 0

    queueService.sendToQueue = async (message) => {
      queueCallCount++
      return true
    }

    const conversionData = {
      from_currency: 'USD',
      to_currency: 'MXN',
      amount: 50,
      converted_amount: 934,
      rate: 18.68,
      provider: 'test'
    }

    await convertService.create(conversionData)

    assert.strictEqual(queueCallCount, 1)

    queueService.sendToQueue = originalSend
  })
})