import * as AWS from 'aws-sdk'

export interface QueueConsumerConfig extends AWS.SQS.Types.ReceiveMessageRequest {
  /**
   * The interval of SQS polling.
   *
   * @var {number}
   */
  Interval?: number
}
