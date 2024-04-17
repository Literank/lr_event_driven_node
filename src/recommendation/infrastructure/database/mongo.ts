import { MongoClient, Db, Collection } from "mongodb";

import { Interest } from "../../../domain/model";
import { InterestManager } from "../../domain/gateway";

const COLL_INTERESTS = "interests";

export class MongoPersistence implements InterestManager {
  private db!: Db;
  private coll!: Collection;
  private pageSize: number;

  constructor(uri: string, dbName: string, pageSize: number) {
    this.pageSize = pageSize;
    const client = new MongoClient(uri);
    client.connect().then(() => {
      this.db = client.db(dbName);
      this.coll = this.db.collection(COLL_INTERESTS);
    });
  }

  async increaseInterest(interest: Interest): Promise<void> {
    const filterQuery = {
      user_id: interest.userId,
      title: interest.title,
      author: interest.author,
    };
    const updateQuery = {
      $inc: { score: 1 },
    };
    await this.coll.updateOne(filterQuery, updateQuery, { upsert: true });
  }

  async listInterests(userId: string): Promise<Interest[]> {
    const filterQuery = { user_id: userId };
    const cursor = this.coll
      .find(filterQuery)
      .sort({ score: -1 })
      .limit(this.pageSize);
    const interestDocs = await cursor.toArray();
    return interestDocs.map((doc) => ({
      userId: doc.user_id,
      title: doc.title,
      author: doc.author,
      score: doc.score,
    }));
  }
}
