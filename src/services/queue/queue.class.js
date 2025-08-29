import { MongoDBService } from '@feathersjs/mongodb'
import amqp from 'amqplib'

export class QueueService extends MongoDBService {
  constructor(options, app) {
    super(options)
    this.app = app
    this.rabbitMQConnection = null
    this.channel = null
    this.queueName = 'conversion_queue'
    this.initRabbitMQ()
  }

  async initRabbitMQ() {
    try {
      this.rabbitMQConnection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672')
      this.channel = await this.rabbitMQConnection.createChannel()
      
      await this.channel.assertQueue(this.queueName, {
        durable: true
      })
      
      console.log('Connected to RabbitMQ successfully')
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error)
    }
  }

  async sendToQueue(message) {
    try {
      if (!this.channel) {
        await this.initRabbitMQ()
      }
      
      const sent = this.channel.sendToQueue(
        this.queueName,
        Buffer.from(JSON.stringify(message)),
        { persistent: true } 
      )
      
      if (sent) {
        console.log('Message sent to RabbitMQ:', message)
        return true
      } else {
        console.warn('Message not sent to RabbitMQ (channel busy)')
        return false
      }
    } catch (error) {
      console.error('Error sending message to RabbitMQ:', error)
      return false
    }
  }

  async closeConnection() {
    if (this.channel) {
      await this.channel.close()
    }
    if (this.rabbitMQConnection) {
      await this.rabbitMQConnection.close()
    }
    console.log('🔌 RabbitMQ connection closed')
  }
}

export const getOptions = app => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then(db => db.collection('queue'))
  }
}