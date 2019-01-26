
export class ListenerBag<T> {

  /**
   * Array of listeners.
   *
   * @var {((t: T) => void)[]}
   */
  private listeners: ((t: T) => void)[]

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
   * Fires the event.
   *
   * @param {T} event
   */
  public dispatch (event: T) : void {
    this.listeners.forEach(l => l(event))
  }
}
