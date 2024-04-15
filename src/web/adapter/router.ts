import express, { Request, Response } from "express";
import { engine } from "express-handlebars";

import { Book } from "../../domain/model";
import { BookOperator } from "../application/executor";
import { WireHelper } from "../application";

class RestHandler {
  private bookOperator: BookOperator;

  constructor(bookOperator: BookOperator) {
    this.bookOperator = bookOperator;
  }

  public async indexPage(req: Request, res: Response): Promise<void> {
    let books: Book[];
    const q = req.query.q as string;
    try {
      books = await this.bookOperator.getBooks(0, q);
    } catch (err) {
      console.warn(`Failed to get books: ${err}`);
      books = [];
    }
    // Render the 'index.handlebars' template, passing data to it
    res.render("index", {
      layout: false,
      title: "LiteRank Book Store",
      books,
      q,
    });
  }

  // Get all books
  public async getBooks(req: Request, res: Response): Promise<void> {
    let offset = parseInt(req.query.o as string);
    if (isNaN(offset)) {
      offset = 0;
    }
    try {
      const books = await this.bookOperator.getBooks(
        offset,
        req.query.q as string
      );
      res.status(200).json(books);
    } catch (err) {
      console.error(`Failed to get books: ${err}`);
      res.status(404).json({ error: "Failed to get books" });
    }
  }

  // Create a new book
  public async createBook(req: Request, res: Response): Promise<void> {
    try {
      const book = await this.bookOperator.createBook(req.body as Book);
      res.status(201).json(book);
    } catch (err) {
      console.error(`Failed to create: ${err}`);
      res.status(404).json({ error: "Failed to create" });
    }
  }
}

// Create router
function MakeRouter(wireHelper: WireHelper): express.Router {
  const restHandler = new RestHandler(
    new BookOperator(wireHelper.bookManager(), wireHelper.messageQueueHelper())
  );

  const router = express.Router();
  router.get("/", restHandler.indexPage.bind(restHandler));
  router.get("/api/books", restHandler.getBooks.bind(restHandler));
  router.post("/api/books", restHandler.createBook.bind(restHandler));
  return router;
}

export function InitApp(
  templates_dir: string,
  wireHelper: WireHelper
): express.Express {
  const app = express();

  // Middleware to parse JSON bodies
  app.use(express.json());

  // Set Handlebars as the template engine
  app.engine("handlebars", engine());
  app.set("view engine", "handlebars");
  // Set the directory for template files
  app.set("views", templates_dir);

  const r = MakeRouter(wireHelper);
  app.use("", r);
  return app;
}
