import { expect } from 'chai'

import { ListenerBag } from '../../src/ListenerBag'

describe('ListenerBag', () => {

  it('attaches and removes a listener', () => {
    const bag: ListenerBag<string> = new ListenerBag()

    const listener: (body: string) => string = body => ''

    bag.addListener(listener)

    expect(bag.hasListener(listener)).to.be.ok

    bag.removeListener(listener)

    expect(bag.hasListener(listener)).to.be.false
  })

  it('dispatches a message', (done) => {
    const bag: ListenerBag<string> = new ListenerBag()

    bag.addListener(m => m === 'message' ? done() : done(new Error()))

    bag.dispatch('message')
  })

})
