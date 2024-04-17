import { readFileSync } from "fs";

interface ApplicationConfig {
  port: number;
  pageSize: number;
}

export interface DatabaseConfig {
  uri: string;
  dbName: string;
}

interface MQConfig {
  brokers: string[];
  topic: string;
  groupId: string;
}

export interface Config {
  app: ApplicationConfig;
  db: DatabaseConfig;
  mq: MQConfig;
}

export function parseConfig(filename: string): Config {
  return JSON.parse(readFileSync(filename, "utf-8"));
}
