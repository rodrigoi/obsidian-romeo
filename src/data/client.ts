// for vercel/neon http/websockets databases
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

// for local development over TCP
import { drizzle as drizzlepg } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/env.mjs";

neonConfig.fetchConnectionCache = true;

export const db =
  process.env.NODE_ENV === "development"
    ? drizzlepg(postgres(env.POSTGRES_URL))
    : drizzle(
        neon(env.POSTGRES_URL, {
          fetchOptions: {
            cache: "no-store",
          },
        })
      );

/**
 * serverless
 * import { Pool } from "@neondatabase/serverless";
 * import { drizzle } from "drizzle-orm/neon-serverless";
 *
 * const pool = new Pool({ connectionString: env.POSTGRES_URL });
 * export const db = drizzle(pool);
 */

// export const db = drizzle(sql);
