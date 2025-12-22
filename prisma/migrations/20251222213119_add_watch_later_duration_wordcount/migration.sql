-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "watchLater" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "wordCount" INTEGER;

-- CreateIndex
CREATE INDEX "Item_watchLater_idx" ON "Item"("watchLater");
