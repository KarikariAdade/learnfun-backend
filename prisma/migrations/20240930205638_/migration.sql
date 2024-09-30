-- AddForeignKey
ALTER TABLE `Past_Questions_Files` ADD CONSTRAINT `Past_Questions_Files_past_question_id_fkey` FOREIGN KEY (`past_question_id`) REFERENCES `Past_Questions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
