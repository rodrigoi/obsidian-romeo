CREATE TABLE IF NOT EXISTS "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"postid" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"url" varchar(255) NOT NULL,
	"publishedat" timestamp NOT NULL,
	"createdat" timestamp DEFAULT now() NOT NULL
);
