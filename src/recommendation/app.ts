import { WireHelper } from "./application";
import { parseConfig } from "./infrastructure/config";
import { InterestConsumer } from "./application/consumer";

const configFilename = "src/recommendation/config.json";

const c = parseConfig(configFilename);
const wireHelper = new WireHelper(c);

const tc = new InterestConsumer(
  wireHelper.interestManager(),
  wireHelper.trendEventConsumer()
);
tc.start();
