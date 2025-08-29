import assert from 'assert'
import { app } from '../../../src/app.js'

describe('queue service', () => {
  let queueService

  beforeAll(() => {
    queueService = app.service('queue')
  })

  it('registered the service', () => {
    assert.ok(queueService, 'Registered the service')
  })

  describe('sendToQueue method', () => {
    it('should handle connection errors gracefully', async () => {
      const message = {
        eventType: 'test_event',
        data: { test: 'data' }
      }

      const result = await queueService.sendToQueue(message)
      assert.strictEqual(result, false) 
    })
  })

  describe('service methods', () => {
    it('should create queue items in database', async () => {
      const testData = {
        message: {
          eventType: 'test_event',
          data: { test: 'value' }
        },
        status: 'pending',
        queueName: 'test_queue'
      }

      const result = await queueService.create(testData)
      assert.ok(result._id)
      assert.strictEqual(result.status, 'pending')
    })

    it('should find queue items', async () => {
      const result = await queueService.find()
      assert.ok(Array.isArray(result))
    })
  })
})