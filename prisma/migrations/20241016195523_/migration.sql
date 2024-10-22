/*
  Warnings:

  - Added the required column `owned_by` to the `Exams` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `exams` DROP FOREIGN KEY `Exams_course_id_fkey`;

-- AlterTable
ALTER TABLE `exams` ADD COLUMN `owned_by` ENUM('PAST_QUESTION', 'COURSE') NOT NULL,
    ADD COLUMN `past_question_id` INTEGER NULL,
    MODIFY `course_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Exams` ADD CONSTRAINT `Exams_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `Courses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exams` ADD CONSTRAINT `Exams_past_question_id_fkey` FOREIGN KEY (`past_question_id`) REFERENCES `Past_Questions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
