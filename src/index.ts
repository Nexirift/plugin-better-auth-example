import { useBetterAuth } from "@nexirift/plugin-better-auth";
import { adminClient, usernameClient } from "better-auth/client/plugins";
import { createYoga } from "graphql-yoga";
import { Hono } from "hono";
import { auth } from "./auth";
import { schema } from "./schema";

// Initialize Hono app instance
const app = new Hono();

// Set authentication service URL
process.env.BETTER_AUTH_URL = `http://localhost:3008`;

// Configure authentication plugins
export const plugins = [adminClient()]; // adminClient() is required for allowedRoles

// Initialize GraphQL Yoga instance with authentication
const yoga = createYoga({
  schema,
  maskedErrors: {
    maskError(error) {
      // WARNING: Development only - errors should be properly masked in production
      return error as any;
    },
  },
  plugins: [
    useBetterAuth({
      baseURL: process.env.BETTER_AUTH_URL,
      plugins,
      // Optional configuration:
      // allowedRoles: ["galaxy-access"], // Restrict access to specific roles
      // requireAuth: true, // Force authentication for all requests
      /* Custom error messages:
						messages: {
								invalidToken: 'The provided access token is invalid.',
								expiredToken: 'An invalid or expired access token was provided.',
								invalidPermissions: 'You do not have the necessary permissions to access this resource.',
								authRequired: 'Authentication is required to access this resource.'
						} */
    }),
  ],
});

// Handle authentication endpoints
app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

// Handle GraphQL endpoint
app.on(["POST", "GET"], "/graphql", (c) => {
  return yoga.fetch(c.req.raw);
});

/**
 * Test user endpoint - Creates a test user if login fails
 * @param {Context} c - Hono context
 * @returns {Response} JSON response with user data
 */
app.get("/user", async (c) => {
  try {
    // Attempt to sign in test user
    const user = await auth.api.signInEmail({
      body: {
        email: "test@example.com",
        password: "password1234",
      },
    });
    return c.json({ ...user });
  } catch (ex) {
    const exception = ex as { body: { code: string } };

    // If login fails due to invalid credentials, create new test user
    if (exception.body.code === "INVALID_EMAIL_OR_PASSWORD") {
      const user = await auth.api.signUpEmail({
        body: {
          name: "Test User",
          email: "test@example.com",
          password: "password1234",
        },
      });
      return c.json({ ...user });
    }

    // Handle any other errors
    console.error("User endpoint error:", ex);
    return c.text("An error occurred.", 500);
  }
});

export default app;
