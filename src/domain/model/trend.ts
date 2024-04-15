import { Book } from ".";

export interface Trend {
  query: string;
  books: Book[];
  created_at: Date | null;
}
