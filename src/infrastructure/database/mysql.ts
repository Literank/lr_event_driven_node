import mysql, { ResultSetHeader } from "mysql2";

import { Book } from "../../domain/model";
import { BookManager } from "../../domain/gateway";

export class MySQLPersistence implements BookManager {
  private db: mysql.Connection;
  private page_size: number;

  constructor(dsn: string, page_size: number) {
    this.page_size = page_size;
    this.db = mysql.createConnection(dsn);
    this.db.addListener("error", (err) => {
      console.error("Error connecting to MySQL:", err.message);
    });

    this.db.execute(
      `CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        published_at VARCHAR(15) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
      (err) => {
        if (err) {
          console.error("Error in MySQL:", err.message);
        } else {
          console.log("Successfully initialized tables.");
        }
      }
    );
  }

  async createBook(b: Book): Promise<number> {
    const { title, author, published_at, description } = b;
    const [result] = await this.db
      .promise()
      .query(
        "INSERT INTO books (title, author, published_at, description) VALUES (?, ?, ?, ?)",
        [title, author, published_at, description]
      );
    return (result as ResultSetHeader).insertId;
  }

  close(): void {
    this.db.end();
  }
}
