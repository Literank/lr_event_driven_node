import { BookManager } from "../../domain/gateway";
import { Book } from "../../domain/model";

export class BookOperator {
  private bookManager: BookManager;

  constructor(b: BookManager) {
    this.bookManager = b;
  }

  async createBook(b: Book): Promise<Book> {
    const id = await this.bookManager.createBook(b);
    b.id = id;
    return b;
  }

  async getBooks(offset: number, query: string): Promise<Book[]> {
    return await this.bookManager.getBooks(offset, query);
  }
}
