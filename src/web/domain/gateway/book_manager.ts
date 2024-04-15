import { Book } from "../../../domain/model";

export interface BookManager {
  createBook(b: Book): Promise<number>;
  getBooks(offset: number, keyword: string): Promise<Book[]>;
}
