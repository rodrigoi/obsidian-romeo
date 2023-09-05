import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const result = await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        postId INTEGER NOT NULL,
        title VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL,
        publishedAt TIMESTAMP NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT NOW()
      )`;

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
