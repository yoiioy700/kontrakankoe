import "dotenv/config";
import { defineConfig } from "prisma/config";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // @ts-ignore - Prisma v7 types don't officially export adapter here yet
    adapter: () => {
      const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
      return new PrismaNeon(pool) as any;
    },
  },
});
