import { unstable_cache as cache, revalidateTag } from "next/cache";
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
  .transform((value) => ({
    id: value.id,
    title: value.title,
    url: value.url ?? `https://news.ycombinator.com/item?id=${value.id}`,
    time: value.time,
  }));

type HackerNewsStory = z.output<typeof storySchema>;

/**
 * get all post Ids from either cache or the database. Cache never expires an has
 * to be revalidated if we save new stories.
 */
const getAllPostIds = cache(
  async () => {
    const postIds = await db
      .select({ postId: hackernews.postId })
      .from(hackernews);

    return postIds.map(({ postId }) => postId);
  },
  ["hackernews-stories"],
  {
    revalidate: false,
    tags: ["hackernews-stories"],
  }
);

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
      // get the existing posts Ids into a Set for easy searching.
      const postIds = new Set(await getAllPostIds());
      return storiesIds.filter((postId) => !postIds.has(postId));
    });

    /**
     * bail if there are no new stories to save.
     */
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

      // revalidate cache.
      revalidateTag("hackernews-stories");
    });

    await step.run("send notification email", async () => {
      await resend.emails.send({
        from: `${env.EMAIL_FROM_NAME} <${env.EMAIL_FROM}>`,
        to: [env.EMAIL_TO],
        subject: "[Obsidian Romeo] New Job Postings on Hacker News!",
        react: HNNotification({ stories }) as React.ReactElement,
      });
    });
  }
);
