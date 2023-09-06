import { inngest } from "@/inngest/client";
import { sql } from "@vercel/postgres";
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
    const request = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`
    );
    const story = await storySchema.parseAsync(await request.json());
    const { id, title, url, time } = story;

    const storyURL = url ?? `https://news.ycombinator.com/item?id=${id}`;

    const result = await sql`
      INSERT INTO posts (postId, title, url, publishedAt)
      VALUES (${id}, ${title}, ${storyURL}, to_timestamp(${time}))
    `;

    return { event, body: { result } };
  }
);
