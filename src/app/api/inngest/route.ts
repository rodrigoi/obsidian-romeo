import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";

import { hourlyCheck } from "@/inngest/functions";
import { processStory } from "@/inngest/process-story";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [hourlyCheck, processStory],
});
