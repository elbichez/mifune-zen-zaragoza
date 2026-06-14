import process from "node:process";

export function getServerConfig() {
  return {
    nodeEnv: process.env.NODE_ENV,
    notionApiKey: process.env.NOTION_API_KEY,
    notionDatabaseId: process.env.NOTION_DATABASE_ID,
  };
}