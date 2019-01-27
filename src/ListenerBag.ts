
export class ListenerBag<T> {

  /**
   * Array of listeners.
   *
   * @var {Array<(t: T) => void>}
   */
  private listeners: Array<(t: T) => void> = []

  /**
   * Pushes a new listeners to the array.
   *
   * @param {(t: T) => void} listener
   * @return {ListenerBag<T>}
   */
  public addListener (listener: (t: T) => void) : ListenerBag<T> {
    this.listeners.push(listener)

    return this
  }

  /**
   * Checks if a bag has a certain listener attached.
   *
   * @param {(t: T) => void} listener
   * @return {boolean}
   */
  public hasListener (listener: (t: T) => void) : boolean {
    return this.listeners.indexOf(listener) !== -1
  }

  /**
   * Pops a listener from bag.
   *
   * @param {(t: T) => void} listener
   * @return {ListenerBag<T>}
   */
  public removeListener (listener: (t: T) => void) : ListenerBag<T> {
    this.listeners = this.listeners.filter(l => l !== listener)

    return this
  }

  /**
   * Fires the event.
   *
   * @param {T} event
   */
  public dispatch (event: T) : void {
    this.listeners.forEach(l => l(event))
  }
}
