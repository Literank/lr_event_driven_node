export { KafkaQueue } from "./kafka";

export interface MQHelper {
  sendEvent(key: string, value: Buffer): Promise<boolean>;
}
