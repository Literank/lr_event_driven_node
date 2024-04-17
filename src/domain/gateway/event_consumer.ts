export type ConsumeCallback = (key: Buffer, value: Buffer) => void;

export interface TrendEventConsumer {
  consumeEvents(callback: ConsumeCallback): Promise<void>;
  stop(): Promise<void>;
}
