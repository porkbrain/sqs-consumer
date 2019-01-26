import { expect } from 'chai'
import * as AWS from 'aws-sdk'
import * as sinon from 'sinon'

import { ListenerBag } from '../../src/ListenerBag'
import {
  ConnectionException,
  ListenerException,
  QueueConsumer,
  QueueConsumerConfig,
  QueueMessage,
  TransformException,
} from '../../src'

describe('QueueConsumer', () => {
  const sqs: AWS.SQS = new AWS.SQS()

  const transform: (body: string) => string = body => body + 'ok'

  const config: QueueConsumerConfig = {
    QueueUrl: 'test-url',
    Interval: 1000,
  }

  const app: QueueConsumer<string> = new QueueConsumer(sqs, config, transform)

  beforeEach(() => {
    sinon.stub(sqs, 'receiveMessage')
  })

  afterEach(() => {
    app.onError = new ListenerBag()
    app.onMessage = new ListenerBag()

    ;(sqs.receiveMessage as sinon.SinonStub).restore()
  })

  it('throws an error if Interval is not set on calling run', () => {
    config.Interval = undefined

    expect(() => app.run()).to.throw(/QueueConsumerConfig/)

    config.Interval = 1000
  })

  it('transforms the messages and dispatches them', (done) => {
    ;(sqs.receiveMessage as sinon.SinonStub)
      .withArgs(config)
      .returns({
        promise: () => Promise.resolve({
          Messages: [
            { Body: 'test' },
            { Body: 'test2' }
          ]
        })
      })

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
          throw new Error('Messages not transformed.')
        }
      } catch (error) {
        done(error)
      }
    })

    app.onError.addListener(e => done(e))

    app.runOnce()
  })

  it('starts and stops polling', async () => {
    sinon.stub(app, 'runOnce')

    const stub: sinon. SinonStub = (app.runOnce as sinon.SinonStub)

    stub.returns(undefined)

    config.Interval = 3

    app.run()

    expect(app.isPolling()).to.be.ok

    await new Promise(r => setTimeout(r, 20))

    const callCount: number = stub.callCount

    expect(callCount).to.be.greaterThan(1)

    app.stop()

    expect(app.isPolling()).to.be.false

    await new Promise(r => setTimeout(r, 20))

    expect(stub.callCount).to.be.lessThan(callCount + 1)

    stub.restore()
  })

  it('throws ConnectionException if SQS connection fails', (done) => {
    ;(sqs.receiveMessage as sinon.SinonStub)
      .withArgs(config)
      .returns({
        promise: () => Promise.reject(new Error('message'))
      })

    app.onError.addListener((e) => {
      try {
        expect(e).to.be.instanceOf(ConnectionException)
        expect(e.unwrap().message).to.be.equal('message')

        done()
      } catch (error) {
        done(error)
      }
    })

    app.onMessage.addListener(_ => done(new Error('onMessage')))

    app.runOnce()
  })

  it('throws ListenerException if a listener throws an error', (done) => {
    ;(sqs.receiveMessage as sinon.SinonStub)
      .withArgs(config)
      .returns({
        promise: () => Promise.resolve({
          Messages: [
            { Body: 'test' }
          ]
        })
      })

    app.onMessage.addListener((_) => {
      throw new Error('message')
    })

    app.onError.addListener(e => {
      try {
        expect(e).to.be.an.instanceOf(ListenerException)
        expect(e.unwrap().message).to.be.equal('message')

        done()
      } catch (error) {
        done(error)
      }
    })

    app.runOnce()
  })

  it('throws TransformException if the transform function fails', (done) => {
    ;(sqs.receiveMessage as sinon.SinonStub)
      .withArgs(config)
      .returns({
        promise: () => Promise.resolve({
          Messages: [
            { Body: 'test' }
          ]
        })
      })

    app.onMessage.addListener((_) => {
      throw new Error('onMessage')
    })

    app.onError.addListener(e => {
      try {
        expect(e).to.be.an.instanceOf(TransformException)
        expect(e.unwrap().message).to.be.equal('message')

        done()
      } catch (error) {
        done(error)
      }
    })

    sinon.stub((app as any), 'transformer').value((_: string) => {
      throw new Error('message')
    })

    app.runOnce()

    sinon.stub((app as any), 'transformer').restore()
  })

  it('handles empty queue as empty array', async () => {
    ;(sqs.receiveMessage as sinon.SinonStub)
      .withArgs(config)
      .returns({
        promise: () => Promise.resolve({})
      })

    const spy: sinon.SinonSpy = sinon.spy()

    app.onMessage.addListener(_ => spy)

    app.onError.addListener(_ => spy)

    app.runOnce()

    await new Promise(r => setTimeout(r, 30))

    expect(spy.notCalled).to.be.ok
  })

})
