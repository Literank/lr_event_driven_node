import { Trend } from "../../../domain/model";
import { TrendManager } from "../../domain/gateway";

export class TrendOperator {
  private trendManager: TrendManager;

  constructor(t: TrendManager) {
    this.trendManager = t;
  }

  async createTrend(t: Trend): Promise<number> {
    return await this.trendManager.createTrend(t);
  }

  async topTrends(offset: number): Promise<Trend[]> {
    return await this.trendManager.topTrends(offset);
  }
}
