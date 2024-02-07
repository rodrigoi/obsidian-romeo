import { sql } from "drizzle-orm";
import { z } from "zod";

import { inngest } from "@/inngest/client";
import { resend } from "@/resend/client";
import { db, hackernews } from "@/data";
import { HNNotification } from "@/emails/hn-notification";

import { env } from "@/env.mjs";

const storySchema = z
  .object({
    id: z.number(),
    title: z.string(),
    url: z.string().optional(),
    time: z.number(),
  })
  .transform((value, ctx) => ({
    id: value.id,
    title: value.title,
    url: value.url ?? `https://news.ycombinator.com/item?id=${value.id}`,
    time: value.time,
  }));

export const hackernewsCheck = inngest.createFunction(
  { id: "hackernews-check", name: "check hackernews" },
  { cron: "0 * * * *" },
  async ({ step }) => {
    const storiesIds = await step.run(
      "fetch story IDs from hackernews",
      async () => {
        const request = await fetch(
          "https://hacker-news.firebaseio.com/v0/jobstories.json"
        );
        return await z.array(z.number()).parseAsync(await request.json());
      }
    );

    const newStoriesIds = await step.run("find new stories", async () => {
      const postIds = await db
        .select({ postId: hackernews.postId })
        .from(hackernews);

      return postIds.length === 0
        ? storiesIds
        : storiesIds.filter(
            (storyId: number) =>
              postIds.findIndex((post) => post.postId === storyId) < 0
          );
    });

    if (newStoriesIds.length === 0) {
      return;
    }

    const stories = await Promise.all(
      newStoriesIds.map((storyId: number) =>
        step.run(
          `fetch story details from hackernews for Id ${storyId}`,
          async () => {
            const request = await fetch(
              `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`
            );
            return await storySchema.parseAsync(await request.json());
          }
        )
      )
    );

    await step.run("save stories to the database", async () => {
      await db.insert(hackernews).values(
        stories
          .map(({ id, title, url, time }) => ({
            postId: id,
            title,
            url,
            publishedAt: sql`to_timestamp(${time})`,
          }))
          .reverse()
      );
    });

    await step.run("send notification email", async () => {
      await resend.emails.send({
        from: `${env.EMAIL_FROM_NAME} <${env.EMAIL_FROM}>`,
        to: [env.EMAIL_TO],
        subject: env.EMAIL_SUBJECT,
        react: HNNotification({ stories }) as React.ReactElement,
      });
    });
  }
);
