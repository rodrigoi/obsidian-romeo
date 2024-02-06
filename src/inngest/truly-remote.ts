import { sql } from "drizzle-orm";
import { z } from "zod";

import { inngest } from "@/inngest/client";
import { db, trulyRemote } from "@/data";

import { env } from "@/env.mjs";

const trulyRemoteResponseSchema = z
  .object({
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
  })
  .transform((value, ctx) => {
    return value.records.map((record) => {
      return {
        listingId: record.fields.listingID,
        companyName: record.fields.companyName[0].trim(),
        title: record.fields.role.trim(),
        description: record.fields.listingSummary,
        category: record.fields.roleCategory[0].trim(),
        regions: record.fields.useListingRegions ?? "",
        url: record.fields.roleApplyURL,
        publishedAt: record.fields.createdOn,
      };
    });
  });

export const trulyRemoteCheck = inngest.createFunction(
  { id: "truly-remote", name: "TrulyRemote.co" },
  { cron: "0 * * * * " },
  async ({ event, step }) => {
    const [development, marketing, product] = await step.run(
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
            trulyRemoteResponseSchema.parseAsync(await result.json())
          )
        );
      }
    );

    const posts = [...development, ...marketing, ...product];

    await db.insert(trulyRemote).values(
      posts.map((post) => ({
        ...post,
        publishedAt: sql`to_timestamp(${post.publishedAt})`,
      }))
    );

    return { posts };
  }
);
