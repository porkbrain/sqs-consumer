/**
 * Exports the main app that polls the sqs.
 */

export { QueueConsumer } from './QueueConsumer'

/**
 * Exports the queue configuration interface that
 * with the AWS.SQS.Request.
 */

export { QueueConsumerConfig } from './QueueConsumerConfig'

/**
 * Exports the message type.
 */

export { QueueMessage } from './QueueMessage'

/**
 * Exports message deletion policy enumeration.
 */

export { DeletionPolicy } from './DeletionPolicy'

/**
 * Exports the exceptions classes.
 */

export * from './exceptions'

/**
 * Exports annotations.
 */

export * from './annotations'
