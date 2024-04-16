import express, { Request, Response } from "express";

import { TrendOperator } from "../application/executor";
import { WireHelper } from "../application";

class RestHandler {
  private trendOperator: TrendOperator;

  constructor(trendOperator: TrendOperator) {
    this.trendOperator = trendOperator;
  }

  public async getTrends(req: Request, res: Response): Promise<void> {
    let pageSize = parseInt(req.query.ps as string) || 0;
    try {
      const books = await this.trendOperator.topTrends(pageSize);
      res.status(200).json(books);
    } catch (err) {
      console.error(`Failed to get trends: ${err}`);
      res.status(404).json({ error: "Failed to get trends" });
    }
  }
}

// Create router
function MakeRouter(wireHelper: WireHelper): express.Router {
  const restHandler = new RestHandler(
    new TrendOperator(wireHelper.trendManager())
  );

  const router = express.Router();
  router.get("/trends", restHandler.getTrends.bind(restHandler));
  return router;
}

export function InitApp(wireHelper: WireHelper): express.Express {
  const app = express();

  // Middleware to parse JSON bodies
  app.use(express.json());

  const r = MakeRouter(wireHelper);
  app.use("", r);
  return app;
}
