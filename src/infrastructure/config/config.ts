import { readFileSync } from "fs";

interface DBConfig {
  dsn: string;
}

interface ApplicationConfig {
  port: number;
  page_size: number;
  templates_dir: string;
}

export interface Config {
  app: ApplicationConfig;
  db: DBConfig;
}

export function parseConfig(filename: string): Config {
  return JSON.parse(readFileSync(filename, "utf-8"));
}
