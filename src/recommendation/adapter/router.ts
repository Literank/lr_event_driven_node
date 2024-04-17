import express, { Request, Response } from "express";

import { InterestOperator } from "../application/executor";
import { WireHelper } from "../application";

class RestHandler {
  private interestOperator: InterestOperator;

  constructor(interestOperator: InterestOperator) {
    this.interestOperator = interestOperator;
  }

  public async getInterests(req: Request, res: Response): Promise<void> {
    const uid = (req.query.uid as string) || "";
    try {
      const interests = await this.interestOperator.interestsForUser(uid);
      res.status(200).json(interests);
    } catch (err) {
      console.error(`Failed to get interests: ${err}`);
      res.status(404).json({ error: "Failed to get interests" });
    }
  }
}

// Create router
function MakeRouter(wireHelper: WireHelper): express.Router {
  const restHandler = new RestHandler(
    new InterestOperator(wireHelper.interestManager())
  );

  const router = express.Router();
  router.get("/recommendations", restHandler.getInterests.bind(restHandler));
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
