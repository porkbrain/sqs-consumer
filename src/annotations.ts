import { SQS } from 'aws-sdk'
import { QueueConsumer } from './QueueConsumer'
import { DeletionPolicy } from './DeletionPolicy'
import { QueueConsumerConfig } from './QueueConsumerConfig'

/**
 * The @Listener method annotation to create a listener for AWS SQS messages.
 * This method is then automatically trigerred upon receiving a message.
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
    // Merge the configuration to one type.
    let app: QueueConsumer<T>

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

        // If the deletion policy is to delete on success or always, delete the
        // message.
        if (deletionPolicy === DeletionPolicy.ON_SUCCESS || deletionPolicy === DeletionPolicy.ALWAYS) {
          message.delete()
        }
      } catch (e) {
        // If the deletion policy is to delete always, delete the message.
        if (deletionPolicy === DeletionPolicy.ALWAYS) {
          message.delete()
        }

        throw e
      }
    })

    app.run()
  }
}
