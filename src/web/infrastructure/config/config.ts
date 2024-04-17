import { readFileSync } from "fs";

interface DBConfig {
  dsn: string;
}

interface ApplicationConfig {
  port: number;
  page_size: number;
  templates_dir: string;
}

interface MQConfig {
  brokers: string[];
  topic: string;
}

export interface RemoteServiceConfig {
  trend_url: string;
}

export interface Config {
  app: ApplicationConfig;
  db: DBConfig;
  mq: MQConfig;
  remote: RemoteServiceConfig;
}

export function parseConfig(filename: string): Config {
  return JSON.parse(readFileSync(filename, "utf-8"));
}
