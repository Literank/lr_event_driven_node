import Redis, { RedisOptions } from "ioredis";

import { CacheConfig } from "../config/config";
import { TrendManager } from "../../domain/gateway";
import { Trend } from "../../../domain/model";

const trendsKey = "trends";
const queryKeyPrefix = "q-";

export class RedisCache implements TrendManager {
  private client: Redis;

  constructor(c: CacheConfig) {
    const options: RedisOptions = {
      host: c.host,
      port: c.port,
      password: c.password,
      db: c.db,
      commandTimeout: c.timeout,
    };
    this.client = new Redis(options);
    console.log("Connected to Redis");
  }

  async createTrend(t: Trend): Promise<number> {
    const member = t.query;
    const score = await this.client.zincrby(trendsKey, 1, member);

    const k = queryKeyPrefix + t.query;
    const results = JSON.stringify(t.books);
    await this.client.set(k, results);
    return Number(score);
  }

  async topTrends(offset: number): Promise<Trend[]> {
    const topItems = await this.client.zrevrange(
      trendsKey,
      0,
      offset,
      "WITHSCORES"
    );
    const trends: Trend[] = [];
    for (let i = 0; i < topItems.length; i += 2) {
      const query = topItems[i];
      const t = { query: query, books: [], created_at: null };
      const k = queryKeyPrefix + query;
      const value = await this.client.get(k);
      if (value !== null) {
        t.books = JSON.parse(value);
      }
      trends.push(t);
    }
    return trends;
  }
}
