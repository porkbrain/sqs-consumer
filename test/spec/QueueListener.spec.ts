import { expect } from 'chai'
import * as sinon from 'sinon'

import { SQS } from 'aws-sdk'

import {
  QueueMessage,
  QueueConsumer,
  QueueListener,
  DeletionPolicy,
  QueueConsumerConfig,
} from '../../src'

describe('QueueListener annotation', () => {
  let sqs: SQS
  let consumer: QueueConsumer<Todo>
  let config: QueueConsumerConfig

  beforeEach(() => {
    sqs = new SQS()
    config = {
      request: { QueueUrl: 'test-queue' },
      interval: 10,
    }
    consumer =  new QueueConsumer(sqs, config, JSON.parse)
    sinon.stub(sqs, 'receiveMessage')
    sinon.stub(sqs, 'deleteMessage')
  })

  it('polls for a message using a provided consumer', (done) => {
    ;(sqs.receiveMessage as sinon.SinonStub)
      .withArgs(config.request)
      .returns({
        promise: () => Promise.resolve({
          Messages: [
            { Body: '{"title":"test","completed":true}' }
          ]
        })
      })

    ;(sqs.deleteMessage as sinon.SinonStub)
      .returns({
        promise: () => Promise.resolve()
      })

    class Service {
      @QueueListener<Todo>(consumer)
      public queueListener (message: QueueMessage<Todo>, app: QueueConsumer<Todo>) {
        try {
          expect(message.body).to.deep.equal({ title: 'test', completed: true })
          done()
        } catch (e) { done(e) }

        app.stop()
      }
    }
  })

  it('correctly handles NEVER deletion policy', (done) => {
    ;(sqs.receiveMessage as sinon.SinonStub)
      .withArgs(config.request)
      .returns({
        promise: () => Promise.resolve({
          Messages: [
            { Body: '{"title":"test","completed":true}' }
          ]
        })
      })

    ;(sqs.deleteMessage as sinon.SinonStub)
      .returns({
        promise: async () => done(new Error('should not have been called'))
      })

    class Service {
      @QueueListener<Todo>(consumer, JSON.parse, DeletionPolicy.NEVER)
      public queueListener (message: QueueMessage<Todo>, app: QueueConsumer<Todo>) {
        try {
          expect(message.body).to.deep.equal({ title: 'test', completed: true })
          done()
        } catch (e) { done(e) }

        app.stop()
      }
    }
  })

  it('correctly handles ALWAYS deletion policy', (done) => {
    ;(sqs.receiveMessage as sinon.SinonStub)
      .withArgs(config.request)
      .returns({
        promise: () => Promise.resolve({
          Messages: [
            { Body: '{"title":"test","completed":true}' }
          ]
        })
      })

    ;(sqs.deleteMessage as sinon.SinonStub)
      .returns({
        promise: async () => done()
      })

    class Service {
      @QueueListener<Todo>(consumer, JSON.parse, DeletionPolicy.ALWAYS)
      public queueListener (message: QueueMessage<Todo>, app: QueueConsumer<Todo>) {
        app.stop()
        throw new Error
      }
    }
  })

  it('correctly handles ON_SUCCESS deletion policy (1)', (done) => {
    ;(sqs.receiveMessage as sinon.SinonStub)
      .withArgs(config.request)
      .returns({
        promise: () => Promise.resolve({
          Messages: [
            { Body: '{"title":"test","completed":true}' }
          ]
        })
      })

    ;(sqs.deleteMessage as sinon.SinonStub)
      .returns({
        promise: async () => done(new Error('should not have been called'))
      })

    class Service {
      @QueueListener<Todo>(consumer, JSON.parse, DeletionPolicy.ON_SUCCESS)
      public queueListener (message: QueueMessage<Todo>, app: QueueConsumer<Todo>) {
        done()
        app.stop()
        throw new Error
      }
    }
  })

  it('correctly handles ON_SUCCESS deletion policy (2)', (done) => {
    ;(sqs.receiveMessage as sinon.SinonStub)
      .withArgs(config.request)
      .returns({
        promise: () => Promise.resolve({
          Messages: [
            { Body: '{"title":"test","completed":true}' }
          ]
        })
      })

    ;(sqs.deleteMessage as sinon.SinonStub)
      .returns({
        promise: async () => done()
      })

    class Service {
      @QueueListener<Todo>(consumer, JSON.parse, DeletionPolicy.ON_SUCCESS)
      public queueListener (message: QueueMessage<Todo>, app: QueueConsumer<Todo>) {
        app.stop()
      }
    }
  })

})

interface Todo {
  title: string
  completed: boolean
}
