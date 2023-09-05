import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";

import { hourlyCheck, processStory } from "@/inngest/functions";

export const { GET, POST, PUT } = serve(inngest, [hourlyCheck, processStory]);
