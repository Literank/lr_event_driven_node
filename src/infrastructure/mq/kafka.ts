import { Kafka, Producer } from "kafkajs";

import { MQHelper } from ".";

export class KafkaQueue implements MQHelper {
  private producer: Producer;
  private topic: string;
  private _connected: boolean = false;

  constructor(brokers: string[], topic: string) {
    this.topic = topic;
    const k = new Kafka({
      clientId: "web-svr",
      brokers,
    });
    this.producer = k.producer({ allowAutoTopicCreation: true });
  }

  async sendEvent(key: string, value: Buffer): Promise<boolean> {
    if (!this._connected) {
      await this.connect();
    }
    await this.producer.send({
      topic: this.topic,
      messages: [
        {
          key,
          value,
        },
      ],
    });
    return true;
  }

  async connect(): Promise<void> {
    await this.producer.connect();
    this._connected = true;
  }

  async close(): Promise<void> {
    await this.producer.disconnect();
  }
}
