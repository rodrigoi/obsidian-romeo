import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Tailwind,
} from "@react-email/components";

type HackerNewsStory = {
  id: number;
  url: string;
  title: string;
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
  },
  {
    id: 1346,
    url: "https://skio.com/careers/",
    title:
      "Skio (YC S20) – Subscriptions for Shopify, ReCharge Migrations Is Hiring",
  },
  {
    id: 1345,
    url: "https://news.ycombinator.com/item?id=39254438",
    title: "Meticulous (YC S21) is hiring to eliminate UI testing",
  },
];

export const HNNotification: React.FC<Readonly<HNNotificationProps>> = ({
  stories = [],
}) => (
  <Html>
    <Head />
    <Preview>Found new job offers from Hacker News to check.</Preview>
    <Tailwind>
      <Body className="bg-gray-200 font-sans p-3">
        <Container className="bg-white border-s-gray-500 p-3 rounded-md">
          <Heading as="h3">Obsidian Romeo News</Heading>
          <Heading as="h4">New Hacker News Job Stories</Heading>
          {stories.length === 0 ? (
            <Text>There are no new Hacker News Jobs</Text>
          ) : (
            stories.map((story) => (
              <Text key={story.id} className="leading-4">
                <Link href={story.url}>{story.title}</Link>
              </Text>
            ))
          )}
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default HNNotification;