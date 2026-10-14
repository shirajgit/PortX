-- CreateTable
CREATE TABLE "custom_sections" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'custom',
    "items" JSONB NOT NULL DEFAULT '[]',
    "sort" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "custom_sections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "custom_sections_profile_id_idx" ON "custom_sections"("profile_id");

-- AddForeignKey
ALTER TABLE "custom_sections" ADD CONSTRAINT "custom_sections_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

