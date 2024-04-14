import { WireHelper } from "./application";
import { InitApp } from "./adapter/router";
import { parseConfig } from "./infrastructure/config";

const config_filename = "config.json";

const c = parseConfig(config_filename);
const wireHelper = new WireHelper(c);
const app = InitApp(c.app.templates_dir, wireHelper);

app.listen(c.app.port, () => {
  console.log(`Running on port ${c.app.port}`);
});
