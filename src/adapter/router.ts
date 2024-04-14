import express, { Request, Response } from "express";
import { engine } from "express-handlebars";

import { Book } from "../domain/model";
import { BookOperator } from "../application/executor";
import { WireHelper } from "../application";

class RestHandler {
  private bookOperator: BookOperator;

  constructor(bookOperator: BookOperator) {
    this.bookOperator = bookOperator;
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
    new BookOperator(wireHelper.bookManager())
  );

  const router = express.Router();
  router.get("/", (req, res) => {
    // Render the 'index.handlebars' template, passing data to it
    res.render("index", { layout: false, title: "LiteRank Book Store" });
  });
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
