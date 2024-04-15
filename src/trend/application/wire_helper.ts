import { Config } from "../infrastructure/config";
import { TrendManager } from "../domain/gateway";
import { RedisCache } from "../infrastructure/cache";

// WireHelper is the helper for dependency injection
export class WireHelper {
  private kv_store: RedisCache;

  constructor(c: Config) {
    this.kv_store = new RedisCache(c.cache);
  }

  trendManager(): TrendManager {
    return this.kv_store;
  }
}
