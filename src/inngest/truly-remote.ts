import { inngest } from "@/inngest/client";
import { db, trulyRemote } from "@/data";
import { z } from "zod";

import { env } from "@/env.mjs";

const trulyRemoteResponseSchema = z.object({
  records: z.array(
    z.object({
      fields: z.object({
        listingID: z.number(),
        companyName: z.array(z.string()),
        role: z.string(),
        listingSummary: z.string(),
        roleCategory: z.array(z.string()),
        useListingRegions: z.optional(z.string()),
        roleApplyURL: z.string().url(),
        createdOn: z.coerce.date(),
      }),
    })
  ),
});

export const trulyRemoteCheck = inngest.createFunction(
  { id: "truly-remote", name: "TrulyRemote.co" },
  { cron: "0 * * * * " },
  async ({ event, step }) => {
    const posts = await step.run(
      "Fetch Posts from TrulyRemote.co",
      async () => {
        const results = await Promise.all([
          fetch("https://trulyremote.co/api/getListing", {
            method: "POST",
            body: JSON.stringify({ locations: [], category: ["Development"] }),
            headers: {
              "Content-Type": "application/json",
            },
          }),
          fetch("https://trulyremote.co/api/getListing", {
            method: "POST",
            body: JSON.stringify({ locations: [], category: ["Marketing"] }),
            headers: {
              "Content-Type": "application/json",
            },
          }),
          fetch("https://trulyremote.co/api/getListing", {
            method: "POST",
            body: JSON.stringify({ locations: [], category: ["Product"] }),
            headers: {
              "Content-Type": "application/json",
            },
          }),
        ]);

        return await Promise.all(
          results.map(async (result) =>
            trulyRemoteResponseSchema.safeParseAsync(await result.json())
          )
        );
      }
    );

    return { event, body: { posts } };
  }
);
