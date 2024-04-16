import { Trend } from "../../../domain/model";
import { TrendManager } from "../../domain/gateway";

export class TrendOperator {
  private trendManager: TrendManager;

  constructor(t: TrendManager) {
    this.trendManager = t;
  }

  async topTrends(pageSize: number): Promise<Trend[]> {
    return await this.trendManager.topTrends(pageSize);
  }
}
