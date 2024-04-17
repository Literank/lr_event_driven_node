import { Config } from "../infrastructure/config";
import { InterestManager } from "../domain/gateway";
import { TrendEventConsumer } from "../../domain/gateway";
import { MongoPersistence } from "../infrastructure/database";
import { KafkaConsumer } from "../../infrastructure/mq";

// WireHelper is the helper for dependency injection
export class WireHelper {
  private noSQLPersistence: MongoPersistence;
  private consumer: KafkaConsumer;

  constructor(c: Config) {
    this.noSQLPersistence = new MongoPersistence(
      c.db.uri,
      c.db.dbName,
      c.app.pageSize
    );
    this.consumer = new KafkaConsumer(c.mq.brokers, c.mq.topic, c.mq.groupId);
  }

  interestManager(): InterestManager {
    return this.noSQLPersistence;
  }

  trendEventConsumer(): TrendEventConsumer {
    return this.consumer;
  }
}
