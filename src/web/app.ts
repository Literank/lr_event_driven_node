import { WireHelper } from "./application";
import { InitApp } from "./adapter/router";
import { parseConfig } from "./infrastructure/config";

const config_filename = "src/web/config.json";

const c = parseConfig(config_filename);
const wireHelper = new WireHelper(c);
const app = InitApp(c.app.templates_dir, c.remote, wireHelper);

app.listen(c.app.port, () => {
  console.log(`Running on port ${c.app.port}`);
});
