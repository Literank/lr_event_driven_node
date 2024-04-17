import { Interest } from "../../../domain/model";

export interface InterestManager {
  increaseInterest(i: Interest): Promise<void>;
  listInterests(userId: string): Promise<Interest[]>;
}
