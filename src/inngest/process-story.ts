import { inngest } from "@/inngest/client";
import { db, posts } from "@/data";
import { sql } from "drizzle-orm";
import { z } from "zod";

const storySchema = z.object({
  id: z.number(),
  title: z.string(),
  url: z.string().optional(),
  time: z.number(),
});

export const processStory = inngest.createFunction(
  { name: "process-story", concurrency: 5 },
  { event: "process-story" },
  async ({ event, step }) => {
    const storyId = event.data.storyId;

    const story = await step.run("Fetch Story from Hacker News", async () => {
      const request = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`
      );
      return await storySchema.parseAsync(await request.json());
    });

    const result = await step.run("Insert Story into Database", async () => {
      const { id, title, url, time } = story;
      return await db.insert(posts).values({
        postId: id,
        title,
        url: url ?? `https://news.ycombinator.com/item?id=${id}`,
        publishedAt: sql`to_timestamp(${time})`,
      });
    });

    return { event, body: { result } };
  }
);
