/*
  Warnings:

  - You are about to drop the column `subjectsId` on the `courses` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `courses` DROP FOREIGN KEY `Courses_subjectsId_fkey`;

-- AlterTable
ALTER TABLE `courses` DROP COLUMN `subjectsId`,
    ADD COLUMN `subject_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Courses` ADD CONSTRAINT `Courses_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `Subjects`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
