CREATE TABLE IF NOT EXISTS "trulyRemote" (
	"id" serial PRIMARY KEY NOT NULL,
	"listingId" integer NOT NULL,
	"companyName" text NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"regions" text NOT NULL,
	"url" text NOT NULL,
	"publishedat" timestamp NOT NULL,
	"createdat" timestamp DEFAULT now() NOT NULL
);
