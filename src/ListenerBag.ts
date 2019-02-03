
export class ListenerBag<T> {

  /**
   * Array of listeners.
   */
  private listeners: Array<(t: T) => void> = []

  /**
   * Pushes a new listeners to the array.
   *
   * @param listener Function to add to the listener array
   * @return Itself
   */
  public addListener (listener: (t: T) => void) : ListenerBag<T> {
    this.listeners.push(listener)

    return this
  }

  /**
   * Checks if a bag has a certain listener attached.
   *
   * @param listener Function to check for in the listener array
   * @return Whether given function is in the listener array
   */
  public hasListener (listener: (t: T) => void) : boolean {
    return this.listeners.indexOf(listener) !== -1
  }

  /**
   * Pops a listener from bag.
   *
   * @param listener Function to remove from the listener array
   * @return Itself
   */
  public removeListener (listener: (t: T) => void) : ListenerBag<T> {
    this.listeners = this.listeners.filter(l => l !== listener)

    return this
  }

  /**
   * Fires the event.
   *
   * @param event Event to dispatch to all listeners
   */
  public dispatch (event: T) : void {
    this.listeners.forEach(l => l(event))
  }

}
