import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { card, columns } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { headers } from "next/headers";
import { randomUUID } from "crypto";

// Get all cards for the current user (optionally filtered by columnId)
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const columnId = searchParams.get("columnId");

    let query = db
      .select()
      .from(card)
      .where(eq(card.userId, session.user.id))
      .orderBy(asc(card.position));

    if (columnId) {
      query = db
        .select()
        .from(card)
        .where(and(eq(card.userId, session.user.id), eq(card.columnId, columnId)))
        .orderBy(asc(card.position));
    }

    const cards = await query;

    return NextResponse.json(cards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Create a new card
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description = "", columnId, position = 0 } = body;

    if (!title || !columnId) {
      return NextResponse.json({ error: "Title and columnId are required" }, { status: 400 });
    }

    // Verify column belongs to user
    const columnExists = await db
      .select()
      .from(columns)
      .where(and(eq(columns.id, columnId), eq(columns.userId, session.user.id)))
      .limit(1);

    if (columnExists.length === 0) {
      return NextResponse.json({ error: "Column not found" }, { status: 404 });
    }

    const now = new Date();
    const newCard = {
      id: randomUUID(),
      title,
      description,
      position,
      columnId,
      userId: session.user.id,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(card).values(newCard);

    return NextResponse.json(newCard, { status: 201 });
  } catch (error) {
    console.error("Error creating card:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
