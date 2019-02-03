export class ConsumerException extends Error {

  /**
   * @param caught The details of the error
   */
  constructor (private caught: Error) {
    super()
  }

  /**
   * Returns the inner error.
   *
   * @return Wrapped error
   */
  public unwrap () : Error {
    return this.caught
  }

}

export class ConnectionException extends ConsumerException {
  //
}

export class TransformException extends ConsumerException {
  //
}

export class ListenerException extends ConsumerException {
  //
}
