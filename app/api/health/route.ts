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
    const result = await db.execute(sql`SELECT 1 as ok`);
    checks.db = "connected";
    checks.db_result = result;
  } catch (err: unknown) {
    const error = err as Error & { code?: string; detail?: string; hint?: string };
    checks.db = "FAILED";
    checks.db_error = error?.message;
    checks.db_code = error?.code;
    checks.db_detail = error?.detail;
    checks.db_hint = error?.hint;
  }

  return NextResponse.json(checks);
}
