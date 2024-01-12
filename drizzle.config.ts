import type { Config } from "drizzle-kit";

import { env } from "@/env.mjs";

export default {
  schema: "./src/data/schema.ts",
  out: "./src/data/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: env.POSTGRES_URL,
  },
  verbose: true,
} satisfies Config;
