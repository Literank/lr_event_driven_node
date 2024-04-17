import { Interest } from "../../../domain/model";
import { InterestManager } from "../../domain/gateway";

export class InterestOperator {
  private interestManager: InterestManager;

  constructor(i: InterestManager) {
    this.interestManager = i;
  }

  async interestsForUser(userId: string): Promise<Interest[]> {
    return await this.interestManager.listInterests(userId);
  }
}
