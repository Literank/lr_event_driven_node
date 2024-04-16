import { Kafka, Consumer, EachMessagePayload } from "kafkajs";

import { ConsumeCallback, TrendEventConsumer } from "../../domain/gateway";

const GROUP_ID = "trend-svr";

export class KafkaConsumer implements TrendEventConsumer {
  private consumer: Consumer;
  private topic: string;

  constructor(brokers: string[], topic: string) {
    const kafka = new Kafka({ brokers });
    this.consumer = kafka.consumer({ groupId: GROUP_ID });
    this.topic = topic;
  }

  async consumeEvents(callback: ConsumeCallback): Promise<void> {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: this.topic });

    await this.consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
      }: EachMessagePayload) => {
        if (message.key && message.value) {
          await callback(message.key, message.value);
        } else {
          console.warn(`Null message from ${topic}-${partition}`);
        }
      },
    });
  }

  async stop(): Promise<void> {
    await this.consumer.disconnect();
  }
}
