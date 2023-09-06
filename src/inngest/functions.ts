import { env } from "@/env.mjs";

import { inngest } from "@/inngest/client";
import { resend } from "@/resend/client";
import { sql } from "@vercel/postgres";
import { z } from "zod";

import { EmailTemplate } from "@/components/email-template";

export const hourlyCheck = inngest.createFunction(
  { name: "hourly-check" },
  { event: "hourly-check" },
  async ({ event, step }) => {
    const request = await fetch(
      "https://hacker-news.firebaseio.com/v0/jobstories.json"
    );
    const jobStories = await z
      .array(z.number())
      .parseAsync(await request.json());

    const postIds = await sql<{ postid: number }>`SELECT postId FROM posts`;

    const events = (
      postIds.rowCount === 0
        ? jobStories
        : jobStories.filter((storyId: number) =>
            postIds.rows.findIndex((post) => {
              return post.postid === storyId;
            }) < 0
              ? true
              : false
          )
    ).map((storyId: number) => ({
      name: "process-story",
      data: { storyId },
    }));

    if (events.length > 0) {
      await step.sendEvent(events);
    }

    // await resend.emails.send({
    //   from: `${env.EMAIL_FROM_NAME} <${env.EMAIL_FROM}>`,
    //   to: [env.EMAIL_TO],
    //   subject: env.EMAIL_SUBJECT,
    //   react: EmailTemplate({ stories: [] }) as React.ReactElement,
    // });

    return { event, body: { jobStories, postIds } };
  }
);
