/**
 * Exports the main app that polls the sqs.
 */
export { QueueConsumer } from './QueueConsumer'

/**
 * Exports the queue configuration interface that
 * implements the AWS.SQS.Request.
 */
export { QueueConsumerConfig } from './QueueConsumerConfig'

/**
 * Exports the message type.
 */
export { QueueMessage } from './QueueMessage'
