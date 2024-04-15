import { Config } from "../infrastructure/config";
import { BookManager } from "../domain/gateway";
import { MySQLPersistence } from "../infrastructure/database";
import { KafkaQueue, MQHelper } from "../infrastructure/mq";

// WireHelper is the helper for dependency injection
export class WireHelper {
  private sql_persistence: MySQLPersistence;
  private mq: KafkaQueue;

  constructor(c: Config) {
    this.sql_persistence = new MySQLPersistence(c.db.dsn, c.app.page_size);
    this.mq = new KafkaQueue(c.mq.brokers, c.mq.topic);
  }

  bookManager(): BookManager {
    return this.sql_persistence;
  }

  messageQueueHelper(): MQHelper {
    return this.mq;
  }
}
