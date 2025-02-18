import { BetterAuth } from "@nexirift/plugin-better-auth";
import { createAuthClient } from "better-auth/client";
import { plugins } from ".";

/**
 * Represents the core application context object that is passed through the middleware chain.
 * This context provides access to the HTTP request/response objects and authentication state.
 */
export interface Context {
  /**
   * The incoming HTTP request object containing headers, parameters, body etc.
   */
  request: Request;

  /**
   * The outgoing HTTP response object for sending data back to the client.
   */
  response: Response;

  /**
   * The authentication context providing user session and identity information.
   * This is dynamically typed based on the enabled authentication plugins.
   *
   * The type is inferred from the createAuthClient configuration to ensure
   * type safety when accessing user properties across the application.
   */
  auth: BetterAuth<
    ReturnType<
      typeof createAuthClient<{
        plugins: (typeof plugins)[number][];
      }>
    >["$Infer"]["Session"]["user"]
  >;
}
