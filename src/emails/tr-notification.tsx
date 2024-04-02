import * as React from "react";

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { format } from "date-fns";

type TRListing = {
  listingId: number;
  companyName: string;
  title: string;
  regions: string;
  url: string;
  publishedAt: string;
};

interface TRNotificationProps {
  development: Array<TRListing>;
  marketing: Array<TRListing>;
  product: Array<TRListing>;
}

const developmentListings: Array<TRListing> = [
  {
    listingId: 15954,
    companyName: "Argyle",
    title: "Software Engineer",
    regions: "Anywhere in the world",
    url: "https://boards.greenhouse.io/argyle/jobs/4118171004",
    publishedAt: "2024-02-17T20:30:10.000Z",
  },
  {
    listingId: 15854,
    companyName: "Assembled",
    title: "Software Engineer",
    regions: "North America",
    url: "https://boards.greenhouse.io/assembled/jobs/4410713004",
    publishedAt: "2024-02-16T20:30:10.000Z",
  },
  {
    listingId: 15754,
    companyName: "Lumos",
    title: "Senior Fullstack Engineer",
    regions: "North America, Latin America",
    url: "https://boards.greenhouse.io/lumos/jobs/571938900",
    publishedAt: "2024-02-15T20:30:10.000Z",
  },
];

const marketingListings: Array<TRListing> = [
  {
    listingId: 15953,
    companyName: "1Password",
    title: "Marketing Website QA/UAT Specialist",
    regions: "North America",
    url: "https://jobs.lever.co/1password/e3166b98-600b-4939-b527-7b7d5e915f30",
    publishedAt: "2024-02-14T20:30:10.000Z",
  },
  {
    listingId: 15935,
    companyName: "ProjectDiscovery.io",
    title: "Community Manager",
    regions: "Anywhere in the world",
    url: "https://boards.greenhouse.io/projectdiscoveryinc/jobs/4320408006",
    publishedAt: "2024-02-13T20:30:10.000Z",
  },
  {
    listingId: 15926,
    companyName: "Lumos",
    title: "Head of Product Marketing",
    regions: "North America, Latin Americ",
    url: "https://boards.greenhouse.io/lumos/jobs/5806809003",
    publishedAt: "2024-02-12T20:30:10.000Z",
  },
];

const productListings: Array<TRListing> = [
  {
    listingId: 15932,
    companyName: "Orderly Network",
    title: "Product Manager",
    regions: "Anywhere in the world",
    url: "https://boards.greenhouse.io/orderlynetwork/jobs/5576224003",
    publishedAt: "2024-02-11T20:30:10.000Z",
  },
  {
    listingId: 15925,
    companyName: "Wonders",
    title: "Senior Product Manager - Core Products",
    regions: "North America",
    url: "https://boards.greenhouse.io/wondersco/jobs/4270328006",
    publishedAt: "2024-02-10T20:30:10.000Z",
  },
  {
    listingId: 15912,
    companyName: "Workera",
    title: "Product Manager",
    regions: "Europe, Middle East, Africa",
    url: "https://boards.greenhouse.io/workera/jobs/4313168005",
    publishedAt: "2024-02-09T20:30:10.000Z",
  },
];

const TRCategoryListings = ({
  section,
  listings,
}: {
  section: string;
  listings: Array<TRListing>;
}) => (
  <Section>
    <Heading as="h4" className="m-0 py-2">
      {section}
    </Heading>
    {listings.map((listing) => (
      <Row key={listing.listingId} className="pb-2">
        <Text className="m-0 text-gray-500 text-s">{listing.companyName}</Text>
        <Text className="m-0">
          <Link href={listing.url}>{listing.title}</Link>
        </Text>
        <Text className="m-0 text-gray-500 text-xs">{listing.regions}</Text>
        <Text className="m-0 text-gray-500 text-xs">
          Puiblished: {format(listing.publishedAt, "PPP")}
        </Text>
      </Row>
    ))}
  </Section>
);

export const TRNotification: React.FC<Readonly<TRNotificationProps>> = ({
  development = [],
  marketing = [],
  product = [],
}) => (
  <Html>
    <Preview>Found new job offers on TrulyRemote.co to check.</Preview>
    <Head />
    <Tailwind>
      <Body className="bg-gray-200 font-sans p-3">
        <Container className="bg-white border border-solid border-gray-300 p-3 rounded-lg">
          <Heading as="h3">New TrulyRemote.co Jobs!</Heading>
          {development.length > 0 && (
            <>
              <Hr />
              <TRCategoryListings
                section="Development"
                listings={development}
              />
            </>
          )}
          {marketing.length > 0 && (
            <>
              <Hr />
              <TRCategoryListings section="Marketing" listings={marketing} />
            </>
          )}
          {product.length > 0 && (
            <>
              <Hr />
              <TRCategoryListings section="Product" listings={product} />
            </>
          )}
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default TRNotification;
