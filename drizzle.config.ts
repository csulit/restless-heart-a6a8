import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "mysql",
  out: "src/database/migrations",
  schema: "src/database/schema.ts",
  verbose: true,
  strict: true,
});
