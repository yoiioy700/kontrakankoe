import "dotenv/config";
import { defineConfig } from "prisma/config";
import path from "path";
import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";

const dbPath = "./prisma/dev.db";
const absolutePath = path.resolve(process.cwd(), dbPath);

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: `file:${absolutePath}`,
  },
  migrate: {
    adapter: () => new PrismaBetterSQLite3(absolutePath) as any,
  },
});
