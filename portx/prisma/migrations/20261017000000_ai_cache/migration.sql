-- CreateTable
CREATE TABLE "ai_cache" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_cache_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "ai_cache_created_at_idx" ON "ai_cache"("created_at");
