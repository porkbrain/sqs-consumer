import { expect } from 'chai'
import * as AWS from 'aws-sdk'
import * as AWSMOCK from 'aws-sdk-mock'
import { mock, instance, verify, deepEqual, when, anything } from 'ts-mockito'

import { ListenerBag } from '../../src/ListenerBag'
import { QueueConsumer, QueueConsumerConfig, QueueMessage } from '../../src'

describe('QueueConsumer', () => {
  const sqs: AWS.SQS = mock(AWS.SQS)

  const transformer: any = {
    transform: (body: string) => body + 'ok'
  }

  const config: QueueConsumerConfig = {
    QueueUrl: 'test-url',
    Interval: 1000,
  }

  const app: QueueConsumer<string> = new QueueConsumer(instance(sqs), config, transformer)

  afterEach(() => {
    app.onError = new ListenerBag()
    app.onMessage = new ListenerBag()
  })

  it('throws an error if Interval is not set on calling run', () => {
    config.Interval = undefined

    expect(() => app.run()).to.throw(/QueueConsumerConfig/)

    config.Interval = 1000
  })

  it('runs just once', (done) => {
    AWSMOCK.mock('SQS', 'receiveMessage', ({
      Messages: [
        { Body: 'test' },
        { Body: 'test2' }
      ]
    } as any))
    console.log('die', AWS.SQS)
    when(sqs.receiveMessage(config))
      .thenResolve(({
        Messages: [
          { Body: 'test' },
          { Body: 'test2' }
        ]
      } as any))
    console.log('hello')

    let msgs: string[] = []

    app.onMessage.addListener((m) => {
      try {
        expect(m).to.be.an.instanceOf(QueueMessage)

        msgs.push(m.body)

        if (
          msgs.indexOf('testok') !== -1 &&
          msgs.indexOf('test2ok') !== -1
        ) {
          return done()
        }

        if (msgs.length > 1) {
          throw new Error()
        }
      } catch (error) {
        done(error)
      }
    })

    app.onError.addListener(e => done(e))
  })

  it('starts polling')

  it('stops polling')

  it('throws ConnectionException if SQS connection fails')

  it('throws ListenerException if a listener throws an error')

  it('throws TransformException if the transform function fails')

})
