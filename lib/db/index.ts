import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Strip query params from URL — we set them in code instead
const rawUrl = process.env.DATABASE_URL!;
const connectionString = rawUrl.split("?")[0];

const client = postgres(connectionString, {
  prepare: false, // required for pgbouncer / transaction pooler
  max: 1,
  ssl: { rejectUnauthorized: false },
});
export const db = drizzle(client, { schema });
