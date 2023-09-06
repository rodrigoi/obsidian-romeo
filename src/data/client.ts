import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

export const db = drizzle(sql);

export const Posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  postId: integer("postid").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  publishedAt: timestamp("publishedat").notNull(),
  createdAt: timestamp("createdat").notNull().defaultNow(),
});
