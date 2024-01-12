import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // POSTGRES_DATABASE: z.string().min(1),
    // POSTGRES_HOST: z.string().min(1),
    // POSTGRES_USER: z.string().min(1),
    // POSTGRES_PASSWORD: z.string().min(1),
    // POSTGRES_PRISMA_URL: z.string().url(),
    POSTGRES_URL: z.string().url(),
    POSTGRES_URL_NON_POOLING: z.string().url(),

    INNGEST_EVENT_KEY: z.string().min(1),
    INNGEST_SIGNING_KEY: z.string().min(1),

    RESEND_API_KEY: z.string().min(1),

    EMAIL_FROM_NAME: z.string().min(1),
    EMAIL_FROM: z.string().email(),
    EMAIL_TO: z.string().email(),
    EMAIL_SUBJECT: z.string().min(1),
  },
});
