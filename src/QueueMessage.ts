import { Response } from 'aws-sdk'

export class QueueMessage<T> {

  /**
   * Message receipt handle.
   */
  public get receipt () : string {
    return this.raw.ReceiptHandle
  }

  /**
   * @param sqs Instance of the SQ service
   * @param queue Queue URL
   * @param body The transformed body of the message
   * @param raw Raw SQS Message object for usecases beyond included methods.
   */
  constructor (
    protected sqs: AWS.SQS,
    protected queue: string,
    public body: T,
    public raw: AWS.SQS.Message,
  ) {
    //
  }

  /**
   * Changes visibility timeout of the message.
   *
   * @param secs How many seconds should the message be delayed from being polled again
   * @return Resolves with AWS response object
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
   * @return Resolves with AWS response object
   */
  public delete () : Promise<{ $response: Response<{}, AWS.AWSError>; }> {
    const request: AWS.SQS.Types.DeleteMessageRequest = {
      QueueUrl: this.queue,
      ReceiptHandle: this.receipt,
    }

    return this.sqs.deleteMessage(request).promise()
  }
}
