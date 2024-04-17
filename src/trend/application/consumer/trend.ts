import { Book, Trend } from "../../../domain/model";
import { TrendManager } from "../../domain/gateway";
import { TrendEventConsumer } from "../../../domain/gateway";

export class TrendConsumer {
  private trendManager: TrendManager;
  private eventConsumer: TrendEventConsumer;

  constructor(t: TrendManager, e: TrendEventConsumer) {
    this.trendManager = t;
    this.eventConsumer = e;
  }

  start() {
    const processEvent = async (key: Buffer, data: Buffer): Promise<void> => {
      if (key && data) {
        const parts = key.toString("utf-8").split(":");
        const query = parts[0];
        const books: Book[] = JSON.parse(data.toString("utf-8"));
        const trend: Trend = { query, books };
        await this.trendManager.createTrend(trend);
      }
    };

    this.eventConsumer.consumeEvents(processEvent).catch((err) => {
      console.log("Consumer error:", err);
    });
  }

  getEventConsumer(): TrendEventConsumer {
    return this.eventConsumer;
  }
}
