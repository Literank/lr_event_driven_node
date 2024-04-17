import { readFileSync } from "fs";

interface ApplicationConfig {
  port: number;
}

export interface CacheConfig {
  host: string;
  port: number;
  password: string;
  db: number;
  timeout: number; // in milliseconds
}

interface MQConfig {
  brokers: string[];
  topic: string;
  groupId: string;
}

export interface Config {
  app: ApplicationConfig;
  cache: CacheConfig;
  mq: MQConfig;
}

export function parseConfig(filename: string): Config {
  return JSON.parse(readFileSync(filename, "utf-8"));
}
