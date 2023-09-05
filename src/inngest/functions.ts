import { inngest } from "@/inngest/client";
import { resend } from "@/resend/client";
import { sql } from "@vercel/postgres";

import { EmailTemplate } from "@/components/email-template";

export const hourlyCheck = inngest.createFunction(
  { name: "hourly-check" },
  { event: "hourly-check" },
  async ({ event, step }) => {
    const request = await fetch(
      "https://hacker-news.firebaseio.com/v0/jobstories.json"
    );
    const jobStories = await request.json();

    const postIds = await sql<{ postId: number }>`SELECT postId FROM posts`;

    if (postIds.rowCount > 0) {
    } else {
      const events = jobStories.map((storyId: number) => ({
        name: "process-story",
        data: { storyId },
      }));

      await step.sendEvent(events);

      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: [process.env.EMAIL_TO!],
        subject: process.env.EMAIL_SUBJECT!,
        react: EmailTemplate({ stories: [] }) as React.ReactElement,
      });
    }

    return { event, body: { jobStories, postIds } };
  }
);

export const processStory = inngest.createFunction(
  { name: "process-story", concurrency: 5 },
  { event: "process-story" },
  async ({ event, step }) => {
    const storyId = event.data.storyId;
    const request = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`
    );
    const story = await request.json();
    const { id, title, url, time } = story;

    const storyURL = url ?? `https://news.ycombinator.com/item?id=${id}`;

    const result = await sql`
      INSERT INTO posts (postId, title, url, publishedAt)
      VALUES (${id}, ${title}, ${storyURL}, to_timestamp(${time}))
    `;

    return { event, body: { result } };
  }
);