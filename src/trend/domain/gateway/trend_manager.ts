import { Trend } from "../../../domain/model";

export interface TrendManager {
  createTrend(t: Trend): Promise<number>;
  topTrends(pageSize: number): Promise<Trend[]>;
}
