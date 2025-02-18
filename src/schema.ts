import SchemaBuilder from "@pothos/core";
import { Context } from "./context";

/**
 * Initialize GraphQL schema builder with Context type
 */
const builder = new SchemaBuilder<{
  Context: Context;
}>({});

/**
 * Define root Query type with hello field
 * Returns greeting with username if authenticated, otherwise "Anonymous"
 */
builder.queryType({
  fields: (t) => ({
    hello: t.string({
      description:
        "Returns personalized greeting based on authentication status",
      resolve: (_root, _args, ctx: Context) => {
        const username = ctx.auth?.user?.name || "Anonymous";
        return `Hello ${username}`;
      },
    }),
  }),
});

// Export final compiled schema
export const schema = builder.toSchema();
