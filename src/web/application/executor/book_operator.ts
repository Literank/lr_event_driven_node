import { BookManager } from "../../domain/gateway";
import { Book, Trend } from "../../../domain/model";
import { MQHelper } from "../../infrastructure/mq";

export class BookOperator {
  private bookManager: BookManager;
  private mqHelper: MQHelper;

  constructor(b: BookManager, m: MQHelper) {
    this.bookManager = b;
    this.mqHelper = m;
  }

  async createBook(b: Book): Promise<Book> {
    const id = await this.bookManager.createBook(b);
    b.id = id;
    return b;
  }

  async getBooks(
    offset: number,
    userId: string,
    query: string
  ): Promise<Book[]> {
    const books = await this.bookManager.getBooks(offset, query);
    if (query) {
      const k = query + ":" + userId;
      const jsonData = JSON.stringify(books);
      await this.mqHelper.sendEvent(k, Buffer.from(jsonData, "utf8"));
    }
    return books;
  }

  async getTrends(trendURL: string): Promise<Trend[]> {
    const resp = await fetch(trendURL);
    const trends: Trend[] = await resp.json();
    return trends;
  }
}
