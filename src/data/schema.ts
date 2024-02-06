import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  postId: integer("postid").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  publishedAt: timestamp("publishedat").notNull(),
  createdAt: timestamp("createdat").notNull().defaultNow(),
});

export const trulyRemote = pgTable("trulyRemote", {
  id: serial("id").primaryKey(),
  listingId: integer("listingId").notNull(),
  companyName: text("companyName").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  regions: text("regions"),
  url: text("url").notNull(),
  publishedAt: timestamp("publishedat").notNull(),
  createdAt: timestamp("createdat").notNull().defaultNow(),
});

export type InsertTrulyRemote = InferInsertModel<typeof trulyRemote>;
