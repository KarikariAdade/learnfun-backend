/*
  Warnings:

  - You are about to drop the column `duration` on the `exams` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `exams` DROP FOREIGN KEY `Exams_educator_id_fkey`;

-- AlterTable
ALTER TABLE `exams` DROP COLUMN `duration`,
    MODIFY `duration_in_minutes` INTEGER NULL,
    MODIFY `start_time` DATETIME(3) NULL,
    MODIFY `end_time` DATETIME(3) NULL,
    MODIFY `educator_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Exams` ADD CONSTRAINT `Exams_educator_id_fkey` FOREIGN KEY (`educator_id`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
