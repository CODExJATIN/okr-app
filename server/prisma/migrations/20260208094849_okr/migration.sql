/*
  Warnings:

  - You are about to drop the column `objective` on the `Objective` table. All the data in the column will be lost.
  - Added the required column `title` to the `Objective` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Objective" DROP COLUMN "objective",
ADD COLUMN     "title" TEXT NOT NULL;
