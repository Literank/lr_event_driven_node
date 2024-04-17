import { Config } from "../infrastructure/config";
import { TrendManager } from "../domain/gateway";
import { TrendEventConsumer } from "../../domain/gateway";
import { RedisCache } from "../infrastructure/cache";
import { KafkaConsumer } from "../../infrastructure/mq";

// WireHelper is the helper for dependency injection
export class WireHelper {
  private kv_store: RedisCache;
  private consumer: KafkaConsumer;

  constructor(c: Config) {
    this.kv_store = new RedisCache(c.cache);
    this.consumer = new KafkaConsumer(c.mq.brokers, c.mq.topic, c.mq.groupId);
  }

  trendManager(): TrendManager {
    return this.kv_store;
  }

  trendEventConsumer(): TrendEventConsumer {
    return this.consumer;
  }
}
