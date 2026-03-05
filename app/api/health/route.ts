import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const rawUrl = process.env.DATABASE_URL || "";
  // Show host/port but hide password
  const safeUrl = rawUrl.replace(/:([^@]+)@/, ":***@");

  const checks: Record<string, unknown> = {
    DATABASE_URL: rawUrl ? safeUrl : "MISSING",
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ? "set" : "MISSING",
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "not set",
    NODE_ENV: process.env.NODE_ENV,
  };

  try {
    const result = await db.execute(sql`SELECT 1 as ok`);
    checks.db = "connected";
    checks.db_result = result;
  } catch (err: unknown) {
    checks.db = "FAILED";
    checks.db_error = String(err);
    checks.db_full = JSON.stringify(err, Object.getOwnPropertyNames(err as object));
  }

  return NextResponse.json(checks);
}
