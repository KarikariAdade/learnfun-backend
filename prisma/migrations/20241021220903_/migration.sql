/*
  Warnings:

  - You are about to drop the column `choice_test` on the `choices` table. All the data in the column will be lost.
  - Added the required column `choice_text` to the `Choices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `choices` DROP COLUMN `choice_test`,
    ADD COLUMN `choice_text` MEDIUMTEXT NOT NULL;
