import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

type HackerNewsStory = {
  id: number;
  url: string;
  title: string;
};

interface TRNotificationProps {
  development: Array<any>;
  marketing: Array<any>;
  product: Array<any>;
}

const developmentListings = [
  {
    listingId: 15954,
    companyName: "Argyle",
    title: "Software Engineer",
    regions: "Anywhere in the world",
    url: "https://boards.greenhouse.io/argyle/jobs/4118171004",
  },
  {
    listingId: 15954,
    companyName: "Assembled",
    title: "Software Engineer",
    regions: "North America",
    url: "https://boards.greenhouse.io/assembled/jobs/4410713004",
  },
  {
    listingId: 15954,
    companyName: "Lumos",
    title: "Senior Fullstack Engineer",
    regions: "North America, Latin America",
    url: "https://boards.greenhouse.io/lumos/jobs/571938900",
  },
];

const marketingListings = [
  {
    listingId: 15953,
    companyName: "1Password",
    title: "Marketing Website QA/UAT Specialist",
    regions: "North America",
    url: "https://jobs.lever.co/1password/e3166b98-600b-4939-b527-7b7d5e915f30",
  },
  {
    listingId: 15935,
    companyName: "ProjectDiscovery.io",
    title: "Community Manager",
    regions: "Anywhere in the world",
    url: "https://boards.greenhouse.io/projectdiscoveryinc/jobs/4320408006",
  },
  {
    listingId: 15926,
    companyName: "Lumos",
    title: "Head of Product Marketing",
    regions: "North America, Latin Americ",
    url: "https://boards.greenhouse.io/lumos/jobs/5806809003",
  },
];

const productListings = [
  {
    listingId: 15932,
    companyName: "Orderly Network",
    title: "Product Manager",
    regions: "Anywhere in the world",
    url: "https://boards.greenhouse.io/orderlynetwork/jobs/5576224003",
  },
  {
    listingId: 15925,
    companyName: "Wonders",
    title: "Senior Product Manager - Core Products",
    regions: "North America",
    url: "https://boards.greenhouse.io/wondersco/jobs/4270328006",
  },
  {
    listingId: 15912,
    companyName: "Workera",
    title: "Product Manager",
    regions: "Europe, Middle East, Africa",
    url: "https://boards.greenhouse.io/workera/jobs/4313168005",
  },
];

export const TRNotification: React.FC<Readonly<TRNotificationProps>> = ({
  development = [],
  marketing = [],
  product = [],
}) => (
  <Html>
    <Head />
    <Preview>Found new job offers on TrulyRemote.co to check.</Preview>
    <Tailwind>
      <Body className="bg-gray-200 font-sans p-3">
        <Container className="bg-white border-s-gray-500 p-3 rounded-md">
          <Heading as="h3">Obsidian Romeo News</Heading>
          <Heading as="h4">TrulyRemote.co</Heading>
          {development.length > 0 && (
            <Section>
              <Heading as="h5" className="m-0">
                Development
              </Heading>
              {development.map((listing) => (
                <Text key={listing.id} className="leading-4">
                  <Text>
                    {listing.companyName} ({listing.regions})
                  </Text>
                  <Link href={listing.url}>{listing.title}</Link>
                </Text>
              ))}
            </Section>
          )}
          {marketing.length > 0 && (
            <Section>
              <Heading as="h5" className="m-0">
                Marketing
              </Heading>
              {marketing.map((listing) => (
                <Text key={listing.id} className="leading-4">
                  <Text>
                    {listing.companyName} ({listing.regions})
                  </Text>
                  <Link href={listing.url}>{listing.title}</Link>
                </Text>
              ))}
            </Section>
          )}
          {product.length > 0 && (
            <Section>
              <Heading as="h5" className="m-0">
                Product
              </Heading>
              {product.map((listing) => (
                <Text key={listing.id} className="leading-4">
                  <Text>
                    {listing.companyName} ({listing.regions})
                  </Text>
                  <Link href={listing.url}>{listing.title}</Link>
                </Text>
              ))}
            </Section>
          )}
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default TRNotification;
