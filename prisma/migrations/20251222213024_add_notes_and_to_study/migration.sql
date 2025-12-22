-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "toStudy" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Item_toStudy_idx" ON "Item"("toStudy");
