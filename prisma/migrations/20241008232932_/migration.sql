-- AlterTable
ALTER TABLE `exams` ADD COLUMN `duration` INTEGER NULL,
    ADD COLUMN `is_scheduled` BOOLEAN NOT NULL DEFAULT false;
