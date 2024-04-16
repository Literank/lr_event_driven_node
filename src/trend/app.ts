import { Worker, isMainThread, parentPort } from "worker_threads";

import { WireHelper } from "./application";
import { InitApp } from "./adapter/router";
import { parseConfig } from "./infrastructure/config";
import { TrendConsumer } from "./application/consumer";

const configFilename = "src/trend/config.json";
const stopConsumer = "stop-consumer";
const stopServer = "stop-svr";

const c = parseConfig(configFilename);
const wireHelper = new WireHelper(c);
const app = InitApp(wireHelper);

if (isMainThread) {
  const worker = new Worker(__filename);

  const svr = app.listen(c.app.port, () => {
    console.log(`Running on port ${c.app.port}`);

    worker.on("message", (msg) => {
      // Close the server
      if (msg === stopServer) {
        svr.close(() => {
          console.log("Server is gracefully closed");
          process.exit(0);
        });
      }
    });

    const shutdown = () => {
      console.log("Server is shutting down...");
      // Stop the consumer
      worker.postMessage(stopConsumer);
    };

    // Handle SIGINT (Ctrl+C) and SIGTERM signals
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  });
} else {
  const tc = new TrendConsumer(
    wireHelper.trendManager(),
    wireHelper.trendEventConsumer()
  );
  parentPort?.on("message", async (msg) => {
    if (msg === stopConsumer) {
      await tc.getEventConsumer().stop();
      parentPort?.postMessage(stopServer);
    }
  });
  tc.start();
}
