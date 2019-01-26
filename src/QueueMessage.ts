import { Response } from 'aws-sdk'

export class QueueMessage<T> {

  /**
   * Message receipt handle.
   *
   * @var {string}
   */
  public get receipt () : string {
    return this.raw.ReceiptHandle
  }

    /**
   * @constructor
   *
   * @param {AWS.SQS} sqs
   * @param {string} queue
   * @param {any} content
   */
  constructor (
    private sqs: AWS.SQS,
    private queue: string,
    public body: T,
    public raw: AWS.SQS.Message
  ) {
    //
  }

  /**
   * Changes visibility timeout of the message.
   *
   * @param {number} secs
   * @return {Promise<{ $response: Response<{}, AWS.AWSError>; }>}
   */
  public changeVisibility (secs: number) : Promise<{ $response: Response<{}, AWS.AWSError>; }> {
    const request: AWS.SQS.Types.ChangeMessageVisibilityRequest = {
      QueueUrl: this.queue,
      ReceiptHandle: this.receipt,
      VisibilityTimeout: secs,
    }

    return this.sqs.changeMessageVisibility(request).promise()
  }

  /**
   * Deletes the message from queue.
   *
   * @return {Promise<{ $response: Response<{}, AWS.AWSError>; }>}
   */
  public delete () : Promise<{ $response: Response<{}, AWS.AWSError>; }> {
    const request: AWS.SQS.Types.DeleteMessageRequest = {
      QueueUrl: this.queue,
      ReceiptHandle: this.receipt,
    }

    return this.sqs.deleteMessage(request).promise()
  }
}
