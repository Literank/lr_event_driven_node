import { Book } from "../../../domain/model";
import { InterestManager } from "../../domain/gateway";
import { TrendEventConsumer } from "../../../domain/gateway";

export class InterestConsumer {
  private interestManager: InterestManager;
  private eventConsumer: TrendEventConsumer;

  constructor(i: InterestManager, e: TrendEventConsumer) {
    this.interestManager = i;
    this.eventConsumer = e;
  }

  start() {
    const processEvent = async (key: Buffer, data: Buffer): Promise<void> => {
      if (key && data) {
        const parts = key.toString("utf-8").split(":");
        if (parts.length === 1) {
          // no user_id, ignore it
          return;
        }
        const query = parts[0];
        const books: Book[] = JSON.parse(data.toString("utf-8"));
        const userId = parts[1];
        for (let book of books) {
          this.interestManager.increaseInterest({
            userId,
            title: book.title,
            author: book.author,
            score: 0,
          });
        }
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
