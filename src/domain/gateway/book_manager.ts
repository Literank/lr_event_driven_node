import { Book } from "../model";

export interface BookManager {
  createBook(b: Book): Promise<number>;
}
