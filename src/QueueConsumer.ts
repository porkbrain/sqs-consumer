import * as AWS from 'aws-sdk'
import { ListenerBag } from './ListenerBag'
import { QueueMessage } from './QueueMessage'
import { QueueConsumerConfig } from './QueueConsumerConfig'

export class QueueConsumer<T> {

  /**
   * Listener bag to publish messages to.
   *
   * @var {ListenerBag<QueueMessage>}
   */
  public onMessage: ListenerBag<QueueMessage<T>> = new ListenerBag()

  /**
   * Listener bag to publish errors to.
   *
   * @var {ListenerBag<Error>}
   */
  public onError: ListenerBag<Error> = new ListenerBag()

  /**
   * Interval id that polls the queue.
   *
   * @var {NodeJS.Timeout}
   */
  private runnable: NodeJS.Timeout

  /**
   * @constructor
   *
   * @param {AWS.SQS} sqs
   * @param {QueueConsumerConfig} request
   * @param {(body: string) => T} transformer Transforms the message content body.
   */
  constructor (
    private sqs: AWS.SQS,
    private request: QueueConsumerConfig,
    private transformer: (body: string) => T,
  ) {
    //
  }

  /**
   * Starts polling in interval.
   */
  public run () : void {
    if (typeof this.request.Interval !== 'number') {
      throw new Error(`
        Polling interval missings. Specify it in the
        QueueConsumerConfig object using property Interval: number.
      `)
    }

    this.runnable = setInterval(() => this.runOnce(), this.request.Interval)
  }

  /**
   * Polls data, puts it into message and sends it to the listeners.
   * Also catches errors and distributes them into error listeners.
   */
  public runOnce () : void {
    this.poll()
      .then(messages => messages.forEach(m => this.onMessage.dispatch(m)))
      .catch(e => this.onError.dispatch(e))
  }

  /**
   * Clears next and every subsequential scheduled polling.
   */
  public stop () : void {
    clearInterval(this.runnable)

    this.runnable = undefined
  }

  /**
   * Whether the consumer is polling or not.
   *
   * @return {boolean}
   */
  public isPolling () : boolean {
    return this.runnable !== undefined
  }

  /**
   * Polls the sqs and emits appropriate events.
   *
   * @return {Promise<QueueMessage[]>}
   */
  private async poll () : Promise<Array<QueueMessage<T>>> {
    const { Messages }: AWS.SQS.ReceiveMessageResult = await this.sqs
      .receiveMessage(this.request)
      .promise()

    if (!Array.isArray(Messages)) {
      return []
    }

    return Messages.map(raw => {
      try {
        // We transform the body with transformer. If the transformer
        // throws an error, this message is skipped and an error message
        // is dispatched.
        const body: T = this.transformer(raw.Body)

        return new QueueMessage<T>(this.sqs, this.request.QueueUrl, body, raw)
      } catch (error) {
        this.onError.dispatch(error)

        return null
      }
    }).filter(Boolean)
  }
}
