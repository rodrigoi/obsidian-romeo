import type { Config } from "drizzle-kit";

import { env } from "@/env.mjs";

export default {
  schema: "./src/data/schema.ts",
  out: "./src/data/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.POSTGRES_URL,
  },
  verbose: true,
} satisfies Config;
