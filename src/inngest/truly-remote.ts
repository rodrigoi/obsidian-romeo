import { z } from "zod";

import { inngest } from "@/inngest/client";
import { resend } from "@/resend/client";
import { db, trulyRemote } from "@/data";
import { TRNotification } from "@/emails/tr-notification";

import { env } from "@/env.mjs";

const trulyRemoteResponseSchema = z
  .object({
    records: z.array(
      z.object({
        fields: z.object({
          listingID: z.number(),
          companyName: z.array(z.string()),
          role: z.string(),
          listingSummary: z.optional(z.string()),
          roleCategory: z.array(z.string()),
          useListingRegions: z.optional(z.string()),
          roleApplyURL: z.string().url(),
          createdOn: z.string().datetime({ offset: true }),
        }),
      })
    ),
  })
  .transform((value) => {
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

type TrulyRemoteListings = z.output<typeof trulyRemoteResponseSchema>;

export const trulyRemoteCheck = inngest.createFunction(
  { id: "truly-remote", name: "TrulyRemote.co" },
  { cron: "0 * * * * " },
  async ({ step }) => {
    const [developmentListings, marketingListings, productListings] =
      await step.run("Fetch Posts from TrulyRemote.co", async () => {
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
      });

    /**
     * this needs another look, but works for now
     */
    const [development, marketing, product] = await step.run(
      "find new listings",
      async () => {
        const listingIds = await db
          .select({ listingId: trulyRemote.listingId })
          .from(trulyRemote);

        const listingIdSet = new Set(
          listingIds.map((listing) => listing.listingId)
        );

        const newListings = [
          ...developmentListings,
          ...marketingListings,
          ...productListings,
        ].filter(({ listingId }) => !listingIdSet.has(listingId));

        return [
          newListings.filter(
            ({ category }) => category.toLowerCase() === "development"
          ),
          newListings.filter(
            ({ category }) => category.toLowerCase() === "marketing"
          ),
          newListings.filter(
            ({ category }) => category.toLowerCase() === "product"
          ),
        ] as TrulyRemoteListings[];
      }
    );

    if (
      development.length === 0 &&
      marketing.length === 0 &&
      product.length === 0
    ) {
      return;
    }

    await step.run("save listings to the database", async () => {
      await db.insert(trulyRemote).values(
        [...development, ...marketing, ...product]
          .map((post) => ({
            ...post,
            publishedAt: new Date(post.publishedAt),
          }))
          .reverse()
      );
    });

    await step.run("send notification email", async () => {
      await resend.emails.send({
        from: `${env.EMAIL_FROM_NAME} <${env.EMAIL_FROM}>`,
        to: [env.EMAIL_TO],
        subject: "News TrulyRemote.co Job Postings from Obsidian Romeo!",
        react: TRNotification({
          development,
          marketing,
          product,
        }) as React.ReactElement,
      });
    });
  }
);
