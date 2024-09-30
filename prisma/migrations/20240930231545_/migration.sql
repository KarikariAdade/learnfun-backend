/*
  Warnings:

  - You are about to drop the column `subject` on the `past_questions` table. All the data in the column will be lost.
  - Added the required column `name` to the `Past_Questions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `past_questions` DROP COLUMN `subject`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;
