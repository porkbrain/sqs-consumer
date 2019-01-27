import { expect } from 'chai'
import * as sinon from 'sinon'

import { QueueMessage } from '../../src'

describe('QueueMessage', () => {
  const sqs: any = {
    changeMessageVisibility: sinon.stub(),
    deleteMessage: sinon.stub(),
  }

  const raw: any = { ReceiptHandle: 'test-handle' }

  const message: QueueMessage<string> = new QueueMessage(sqs, 'test-url', 'test-body', raw)

  it('has receipt, body and raw message', () => {
    expect(message.raw).to.equal(raw)
    expect(message.body).to.be.equal('test-body')
    expect(message.receipt).to.be.equal('test-handle')
  })

  it('deletes itself', async () => {
    sqs.deleteMessage
      .withArgs(sinon.match({
        QueueUrl: 'test-url',
        ReceiptHandle: 'test-handle',
      }))
      .returns({
        promise: () => Promise.resolve('ok')
      })

    expect(await message.delete()).to.equal('ok')
  })

  it('changes its visibility', async () => {
    sqs.changeMessageVisibility
      .withArgs(sinon.match({
        QueueUrl: 'test-url',
        ReceiptHandle: 'test-handle',
        VisibilityTimeout: 10
      }))
      .returns({
        promise: () => Promise.resolve('ok')
      })

    expect(await message.changeVisibility(10)).to.equal('ok')
  })

})
