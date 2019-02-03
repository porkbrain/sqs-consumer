import * as AWS from 'aws-sdk'

export interface QueueConsumerConfig {

  /**
   * The interval of SQS polling.
   */
  interval?: number

  /**
   * AWS request that is sent to retrieve messages.
   */
  request: AWS.SQS.Types.ReceiveMessageRequest

}
