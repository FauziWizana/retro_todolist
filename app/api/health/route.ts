import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, unknown> = {
    DATABASE_URL: process.env.DATABASE_URL ? "set" : "MISSING",
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ? "set" : "MISSING",
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "not set",
    NODE_ENV: process.env.NODE_ENV,
  };

  try {
    await db.execute(sql`SELECT 1`);
    checks.db = "connected";
  } catch (err) {
    checks.db = "FAILED: " + String(err);
  }

  return NextResponse.json(checks);
}
