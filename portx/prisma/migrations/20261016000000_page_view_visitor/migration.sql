-- AlterTable
ALTER TABLE "page_views" ADD COLUMN "visitor" TEXT;

-- CreateIndex
CREATE INDEX "page_views_profile_id_kind_created_at_idx" ON "page_views"("profile_id", "kind", "created_at");

-- CreateIndex
CREATE INDEX "page_views_visitor_created_at_idx" ON "page_views"("visitor", "created_at");
