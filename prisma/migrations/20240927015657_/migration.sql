/*
  Warnings:

  - Added the required column `school_group_id` to the `Past_Questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject_id` to the `Past_Questions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `courses` ADD COLUMN `subjectsId` INTEGER NULL;

-- AlterTable
ALTER TABLE `past_questions` ADD COLUMN `school_group_id` INTEGER NOT NULL,
    ADD COLUMN `subject_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Subjects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `School_Groups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Past_Questions` ADD CONSTRAINT `Past_Questions_school_group_id_fkey` FOREIGN KEY (`school_group_id`) REFERENCES `School_Groups`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Past_Questions` ADD CONSTRAINT `Past_Questions_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `Subjects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Courses` ADD CONSTRAINT `Courses_subjectsId_fkey` FOREIGN KEY (`subjectsId`) REFERENCES `Subjects`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
