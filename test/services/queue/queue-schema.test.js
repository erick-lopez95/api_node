import assert from 'assert'
import { queueDataValidator } from '../../src/services/queue/queue.schema.js' 
import { dataValidator } from '../../src/validators.js'

describe('queue schema validation', () => {
  it('should validate correct queue data', () => {
    const validData = {
      message: {
        eventType: 'test_event',
        data: { test: 'value' }
      },
      status: 'pending',
      queueName: 'test_queue'
    }

    const result = queueDataValidator(validData, dataValidator)
    assert.ok(result)
  })

  it('should reject invalid status values', () => {
    const invalidData = {
      message: { eventType: 'test' },
      status: 'invalid_status',
      queueName: 'test_queue'
    }

    try {
      queueDataValidator(invalidData, dataValidator)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.ok(error.message.includes('must be equal to one of the allowed values'))
    }
  })
})