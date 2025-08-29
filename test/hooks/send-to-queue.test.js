import assert from 'assert'
import { sendToQueue } from '../../src/hooks/send-to-queue.js'

describe('sendToQueue hook', () => {
  it('should only run on create method', async () => {
    const hook = sendToQueue()
    const context = {
      method: 'find',
      result: { _id: 'test' }
    }

    const result = await hook(context)
    assert.deepStrictEqual(result, context)
  })

  it('should send message to queue on successful conversion', async () => {
    const hook = sendToQueue()
    const mockQueueService = {
      sendToQueue: async (message) => {
        assert.strictEqual(message.eventType, 'conversion_created')
        return true
      }
    }

    const context = {
      method: 'create',
      result: {
        _id: '12345',
        from_currency: 'USD',
        to_currency: 'MXN',
        amount: 100
      },
      app: {
        service: () => mockQueueService
      }
    }

    const result = await hook(context)
    assert.deepStrictEqual(result, context)
  })
})