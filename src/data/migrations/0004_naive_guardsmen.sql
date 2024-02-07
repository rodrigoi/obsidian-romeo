CREATE TABLE IF NOT EXISTS "hackernews" (
	"id" serial PRIMARY KEY NOT NULL,
	"postid" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"url" varchar(255) NOT NULL,
	"publishedat" timestamp NOT NULL,
	"createdat" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "posts";