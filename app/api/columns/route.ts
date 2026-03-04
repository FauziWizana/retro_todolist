import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { columns } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { headers } from "next/headers";
import { randomUUID } from "crypto";

// Get all columns for the current user
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const columns_list = await db
      .select()
      .from(columns)
      .where(eq(columns.userId, session.user.id))
      .orderBy(asc(columns.position));

    return NextResponse.json(columns_list);
  } catch (error) {
    console.error("Error fetching columns:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Create a new column
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, color = "#ec4899", position = 0 } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const now = new Date();
    const newColumn = {
      id: randomUUID(),
      name,
      color,
      position,
      userId: session.user.id,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(columns).values(newColumn);

    return NextResponse.json(newColumn, { status: 201 });
  } catch (error) {
    console.error("Error creating column:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
