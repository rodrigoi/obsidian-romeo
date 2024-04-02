import * as React from "react";
import { format } from "date-fns";

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type HackerNewsStory = {
  id: number;
  url: string;
  title: string;
  time: number;
};

interface HNNotificationProps {
  stories: Array<HackerNewsStory>;
}

const hackerNewsStories: Array<HackerNewsStory> = [
  {
    id: 13467,
    url: "https://www.ashbyhq.com/careers?ashby_jid=933570bc-a3d6-4fcc-991d-dc399c53a58a",
    title:
      "Ashby (YC W19) is hiring a product engineering manager in Americas (remote)",
    time: 1708189252,
  },
  {
    id: 1346,
    url: "https://skio.com/careers/",
    title:
      "Skio (YC S20) – Subscriptions for Shopify, ReCharge Migrations Is Hiring",
    time: 1708079252,
  },
  {
    id: 1345,
    url: "https://news.ycombinator.com/item?id=39254438",
    title: "Meticulous (YC S21) is hiring to eliminate UI testing",
    time: 1707979252,
  },
];

export const HNNotification: React.FC<Readonly<HNNotificationProps>> = ({
  stories = [],
}) => (
  <Html>
    <Preview>Found new job offers from Hacker News to check.</Preview>
    <Tailwind>
      <Head />
      <Body className="bg-gray-200 font-sans p-3">
        <Container className="bg-white border border-solid border-gray-300 p-3 rounded-lg">
          <Heading as="h3">New Hacker News Job Stories!</Heading>
          <Section>
            {stories.length > 0 &&
              stories.map((story) => (
                <Row key={story.id} className="py-2">
                  <Text className="m-0">
                    <Link href={story.url}>{story.title}</Link>
                  </Text>
                  <Text className="m-0 text-gray-500 text-xs">
                    Puiblished: {format(story.time * 1000, "PPP")}
                  </Text>
                </Row>
              ))}
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default HNNotification;
