import { BookManager } from "../../domain/gateway";
import { Book } from "../../domain/model";
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

  async getBooks(offset: number, query: string): Promise<Book[]> {
    const books = await this.bookManager.getBooks(offset, query);
    if (query) {
      const jsonData = JSON.stringify(books);
      await this.mqHelper.sendEvent(query, Buffer.from(jsonData, "utf8"));
    }
    return books;
  }
}
