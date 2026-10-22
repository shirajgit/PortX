import "dotenv/config";
import { defineConfig } from "prisma/config";

/* The board only generates a client from the copied schema; it never migrates the
   database (the main app owns migrations). Generating doesn't need DATABASE_URL. */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
