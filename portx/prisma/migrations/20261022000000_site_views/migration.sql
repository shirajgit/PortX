-- CreateTable
CREATE TABLE "site_views" (
    "id" BIGSERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "ref" TEXT,
    "visitor" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "site_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "site_views_created_at_idx" ON "site_views"("created_at");

-- CreateIndex
CREATE INDEX "site_views_visitor_created_at_idx" ON "site_views"("visitor", "created_at");
