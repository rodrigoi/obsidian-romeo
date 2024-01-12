import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  postId: integer("postid").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  publishedAt: timestamp("publishedat").notNull(),
  createdAt: timestamp("createdat").notNull().defaultNow(),
});
