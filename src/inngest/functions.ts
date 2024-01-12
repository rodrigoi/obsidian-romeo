import { env } from "@/env.mjs";

import { inngest } from "@/inngest/client";
import { resend } from "@/resend/client";
import { db, posts } from "@/data";
import { desc, inArray } from "drizzle-orm";
import { z } from "zod";

import { EmailTemplate } from "@/components/email-template";

export const hourlyCheck = inngest.createFunction(
  { name: "hourly-check" },
  { cron: "0 * * * *" },
  async ({ event, step }) => {
    const jobStories = await step.run(
      "Fetch Stories from Hacker News",
      async () => {
        const request = await fetch(
          "https://hacker-news.firebaseio.com/v0/jobstories.json"
        );
        return await z.array(z.number()).parseAsync(await request.json());
      }
    );

    const newStories = await step.run(
      "Filter out stories already in database",
      async () => {
        const postIds = await db.select({ postId: posts.postId }).from(posts);

        return postIds.length === 0
          ? jobStories
          : jobStories.filter((storyId: number) =>
              postIds.findIndex((post) => {
                return post.postId === storyId;
              }) < 0
                ? true
                : false
            );
      }
    );

    if (newStories.length > 0) {
      const events = newStories.map((storyId: number) => ({
        name: "process-story",
        data: { storyId },
      }));

      await step.sendEvent(events);

      await step.sleep(1000 * 30);

      const results = await step.run(
        "Fetch Details of New Stories from the DB",
        async () => {
          return await db
            .select()
            .from(posts)
            .where(inArray(posts.postId, newStories))
            .orderBy(desc(posts.publishedAt));
        }
      );

      await step.run("Send Email", async () => {
        await resend.emails.send({
          from: `${env.EMAIL_FROM_NAME} <${env.EMAIL_FROM}>`,
          to: [env.EMAIL_TO],
          subject: env.EMAIL_SUBJECT,
          react: EmailTemplate({ stories: results }) as React.ReactElement,
        });
      });
    }

    return { event, body: { newStories } };
  }
);
