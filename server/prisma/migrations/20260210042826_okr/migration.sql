-- AlterTable
ALTER TABLE "KeyResult" ADD COLUMN     "metric" TEXT NOT NULL DEFAULT 'percentage',
ADD COLUMN     "target" INTEGER NOT NULL DEFAULT 100;
