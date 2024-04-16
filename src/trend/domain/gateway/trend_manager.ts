import { Trend } from "../../../domain/model";

export type ConsumeCallback = (key: Buffer, value: Buffer) => void;

export interface TrendManager {
  createTrend(t: Trend): Promise<number>;
  topTrends(pageSize: number): Promise<Trend[]>;
}

export interface TrendEventConsumer {
  consumeEvents(callback: ConsumeCallback): Promise<void>;
  stop(): Promise<void>;
}
