import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";

import { hackernewsCheck } from "@/inngest/hackernews";
import { trulyRemoteCheck } from "@/inngest/truly-remote";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [hackernewsCheck, trulyRemoteCheck],
});
