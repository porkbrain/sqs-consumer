import { expect } from 'chai'

import {
  ConnectionException,
  ConsumerException,
  ListenerException,
  TransformException,
} from '../../src'

describe('Exceptions', () => {

  it('exports all exceptions', () => {
    expect(ConsumerException.prototype).to.be.instanceOf(Error)

    expect(ConnectionException.prototype).to.be.instanceOf(ConsumerException)
    expect(ListenerException.prototype).to.be.instanceOf(ConsumerException)
    expect(TransformException.prototype).to.be.instanceOf(ConsumerException)
  })

  it('takes error in constructor and unwraps it', () => {
    const error: Error = new Error('message')

    const exception: ConsumerException = new ConsumerException(error)

    expect(exception.unwrap()).to.be.instanceOf(Error)
    expect(exception.unwrap().message).to.be.equal('message')
  })

})
