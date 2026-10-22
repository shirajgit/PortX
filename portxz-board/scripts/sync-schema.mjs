/* The board reads the main app's database but never migrates it. Its Prisma schema is a
   copy of ../portx/prisma/schema.prisma, refreshed here on every install. When the main
   app isn't next to it (e.g. a deploy of this folder alone), the committed copy is used. */
import { copyFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const src = fileURLToPath(new URL("../../portx/prisma/schema.prisma", import.meta.url));
const dest = fileURLToPath(new URL("../prisma/schema.prisma", import.meta.url));

if (existsSync(src)) {
  copyFileSync(src, dest);
  console.log("sync-schema: copied prisma/schema.prisma from the main app");
} else {
  console.log("sync-schema: main app not found, using the committed schema");
}
