/*
  Warnings:

  - You are about to drop the `chatmessages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chatparticipants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `examresults` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `examsubmissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `messagereadstatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `postmedia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `studentanswers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `chatmessages` DROP FOREIGN KEY `ChatMessages_chat_id_fkey`;

-- DropForeignKey
ALTER TABLE `chatmessages` DROP FOREIGN KEY `ChatMessages_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `chatparticipants` DROP FOREIGN KEY `ChatParticipants_chat_id_fkey`;

-- DropForeignKey
ALTER TABLE `chatparticipants` DROP FOREIGN KEY `ChatParticipants_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `examresults` DROP FOREIGN KEY `ExamResults_exam_id_fkey`;

-- DropForeignKey
ALTER TABLE `examresults` DROP FOREIGN KEY `ExamResults_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `examsubmissions` DROP FOREIGN KEY `ExamSubmissions_exam_id_fkey`;

-- DropForeignKey
ALTER TABLE `examsubmissions` DROP FOREIGN KEY `ExamSubmissions_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `messagereadstatus` DROP FOREIGN KEY `MessageReadStatus_message_id_fkey`;

-- DropForeignKey
ALTER TABLE `messagereadstatus` DROP FOREIGN KEY `MessageReadStatus_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `postmedia` DROP FOREIGN KEY `PostMedia_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `studentanswers` DROP FOREIGN KEY `StudentAnswers_question_id_fkey`;

-- DropForeignKey
ALTER TABLE `studentanswers` DROP FOREIGN KEY `StudentAnswers_selected_choice_id_fkey`;

-- DropForeignKey
ALTER TABLE `studentanswers` DROP FOREIGN KEY `StudentAnswers_submission_id_fkey`;

-- DropTable
DROP TABLE `chatmessages`;

-- DropTable
DROP TABLE `chatparticipants`;

-- DropTable
DROP TABLE `examresults`;

-- DropTable
DROP TABLE `examsubmissions`;

-- DropTable
DROP TABLE `messagereadstatus`;

-- DropTable
DROP TABLE `postmedia`;

-- DropTable
DROP TABLE `studentanswers`;

-- CreateTable
CREATE TABLE `Exam_Submissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` INTEGER NOT NULL,
    `exam_id` INTEGER NOT NULL,
    `submitted_at` DATETIME(3) NOT NULL,
    `score` DECIMAL(5, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student_Answers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `submission_id` INTEGER NOT NULL,
    `question_id` INTEGER NOT NULL,
    `selected_choice_id` INTEGER NOT NULL,
    `answer_text` LONGTEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Exam_Results` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` INTEGER NOT NULL,
    `exam_id` INTEGER NOT NULL,
    `total_score` DECIMAL(5, 2) NOT NULL,
    `time_taken` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chat_Participants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chat_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `is_admin` BOOLEAN NOT NULL DEFAULT false,
    `join_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chat_Messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chat_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `message_text` LONGTEXT NOT NULL,
    `message_type` ENUM('TEXT', 'FILE', 'IMAGE', 'VIDEO') NOT NULL DEFAULT 'TEXT',
    `file_url` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message_Read_Status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `read_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post_Media` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `post_id` INTEGER NOT NULL,
    `media_url` VARCHAR(191) NOT NULL,
    `media_type` ENUM('IMAGE', 'VIDEO', 'AUDIO') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Exam_Submissions` ADD CONSTRAINT `Exam_Submissions_exam_id_fkey` FOREIGN KEY (`exam_id`) REFERENCES `Exams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exam_Submissions` ADD CONSTRAINT `Exam_Submissions_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student_Answers` ADD CONSTRAINT `Student_Answers_submission_id_fkey` FOREIGN KEY (`submission_id`) REFERENCES `Exam_Submissions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student_Answers` ADD CONSTRAINT `Student_Answers_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `Questions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student_Answers` ADD CONSTRAINT `Student_Answers_selected_choice_id_fkey` FOREIGN KEY (`selected_choice_id`) REFERENCES `Choices`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exam_Results` ADD CONSTRAINT `Exam_Results_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exam_Results` ADD CONSTRAINT `Exam_Results_exam_id_fkey` FOREIGN KEY (`exam_id`) REFERENCES `Exams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat_Participants` ADD CONSTRAINT `Chat_Participants_chat_id_fkey` FOREIGN KEY (`chat_id`) REFERENCES `Chats`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat_Participants` ADD CONSTRAINT `Chat_Participants_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat_Messages` ADD CONSTRAINT `Chat_Messages_chat_id_fkey` FOREIGN KEY (`chat_id`) REFERENCES `Chats`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat_Messages` ADD CONSTRAINT `Chat_Messages_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message_Read_Status` ADD CONSTRAINT `Message_Read_Status_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message_Read_Status` ADD CONSTRAINT `Message_Read_Status_message_id_fkey` FOREIGN KEY (`message_id`) REFERENCES `Chat_Messages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post_Media` ADD CONSTRAINT `Post_Media_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `Posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
