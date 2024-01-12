import { db, posts } from "@/data";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const result = await db.select().from(posts);

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
