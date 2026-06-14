import process from "node:process";
import { config as loadEnv } from "dotenv";

loadEnv();

export function getServerConfig() {
  return {
    nodeEnv: process.env.NODE_ENV,
    notionApiKey: process.env.NOTION_API_KEY,
    notionDatabaseId: process.env.NOTION_DATABASE_ID,
  };
}