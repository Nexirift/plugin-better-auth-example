import { betterAuth } from "better-auth";
import { Database } from "bun:sqlite";
import { BunSqliteDialect } from "kysely-bun-sqlite";
import { admin, bearer, username } from "better-auth/plugins";

// Initialize authentication configuration with better-auth
export const auth = betterAuth({
  // Configure authentication plugins
  plugins: [
    bearer(), // Required for API token authentication
    admin(), // Enables admin user functionality
  ],

  // Enable email/password authentication
  emailAndPassword: {
    enabled: true,
  },

  // Configure SQLite database connection
  database: {
    type: "sqlite",
    dialect: new BunSqliteDialect({
      database: new Database("./sqlite.db"), // Local SQLite database file
    }),
  },
});
