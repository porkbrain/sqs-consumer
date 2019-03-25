import { SQS } from 'aws-sdk'
import { QueueConsumer } from './QueueConsumer'
import { DeletionPolicy } from './DeletionPolicy'
import { QueueConsumerConfig } from './QueueConsumerConfig'

/**
 * The @Listener method annotation to create a listener for AWS SQS messages.
 * This method is then automatically trigerred upon receiving a message. If not
 * provided in the configuration, the default interval between polling the queue
 * is 1 second (1000ms).
 *
 * @param consumerConfig The consumer configuration, the queue URL or the consumer itself
 * @param transform The message transformer
 * @param deletionPolicy The message deletion policy
 */
export function QueueListener<T> (
  consumerConfig: QueueConsumer<T> | QueueConsumerConfig | string,
  transform: (body: string) => T = JSON.parse,
  deletionPolicy: DeletionPolicy = DeletionPolicy.ON_SUCCESS,
) : MethodDecorator {
  return (target, key) => {
    let app: QueueConsumer<T>

    // Merge the configuration to one type.
    if (consumerConfig instanceof QueueConsumer) {
      app = consumerConfig
    } else {
      const config: QueueConsumerConfig = typeof consumerConfig === 'string'
        ? { request: { QueueUrl: consumerConfig }, interval: 1000 }
        : consumerConfig

      app = new QueueConsumer(new SQS(), config, transform)
    }

    app.onMessage.addListener(async (message) => {
      try {
        await target[key](message, app)

        // If the deletion policy is to delete on success, delete the message.
        if (deletionPolicy === DeletionPolicy.ON_SUCCESS) {
          message.delete()
        }
      } finally {
        // If the deletion policy is to delete on always, delete the message.
        if (deletionPolicy === DeletionPolicy.ALWAYS) {
          message.delete()
        }
      }
    })

    app.run()
  }
}
