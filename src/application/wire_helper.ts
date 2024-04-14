import { Config } from "../infrastructure/config";
import { BookManager } from "../domain/gateway";
import { MySQLPersistence } from "../infrastructure/database";

// WireHelper is the helper for dependency injection
export class WireHelper {
  private sql_persistence: MySQLPersistence;

  constructor(c: Config) {
    this.sql_persistence = new MySQLPersistence(c.db.dsn, c.app.page_size);
  }

  bookManager(): BookManager {
    return this.sql_persistence;
  }
}
