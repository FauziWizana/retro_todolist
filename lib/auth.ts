import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";
import { randomUUID } from "crypto";

// Default columns to create for new users
const DEFAULT_COLUMNS = [
  { name: "To Do", color: "#d946ef", position: 0 },
  { name: "In Progress", color: "#a855f7", position: 1 },
  { name: "Done", color: "#f472b6", position: 2 },
];

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  user: {
    additionalFields: {},
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Create default columns for the new user
          const now = new Date();
          const columnsToInsert = DEFAULT_COLUMNS.map((col) => ({
            id: randomUUID(),
            name: col.name,
            color: col.color,
            position: col.position,
            userId: user.id,
            createdAt: now,
            updatedAt: now,
          }));

          await db.insert(schema.column).values(columnsToInsert);
        },
      },
    },
  },
});
