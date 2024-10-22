import { Router } from "express";
import passport from 'passport';
import {updateProfile, viewProfile } from "../controllers/profile.controller";
import { profileUpdateValidation } from "../requests/profile.request";
import {createSubject, updateSubject, viewSubjects } from "../controllers/subjects.controller";
import { subjectCreationValidation, subjectUpdateValidation } from "../requests/subjects.request";
import {deletePastQuestions,
    downloadPastQuestions, storePastQuestions, updatePastQuestions, viewPastQuestion, viewPastQuestions} from "../controllers/past_questions.controller";
import multer from 'multer'
import path from "path";
import fs from 'fs';
import { pastQuestionCreationValidation, pastQuestionUpdateValidation } from "../requests/past_questions.request";
import {storeExams, updateExams, viewDetails, viewExams } from "../controllers/exam.controller";
import {examCreationValidation, examDetailValidation, examUpdateValidation} from "../requests/exam.request";
import {deleteQuestions, storeQuestions, updateQuestions, viewQuestions, viewQuestionsDetails } from "../controllers/exam_question.controller";
import {
    examQuestionCreateValidation,
    examQuestionUpdateValidation,
    examQuestionValidation, examQuestionViewValidation
} from "../requests/exam_question.request";

const adminRoutes = Router();

const UPLOAD_DIR = path.join(__dirname, 'uploads', 'fixed_directory');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
    },
})

// Profile Routes

adminRoutes.get('/profile', passport.authenticate('jwt', {session:false}), viewProfile)
adminRoutes.post('/profile/update', passport.authenticate('jwt', {session:false}), profileUpdateValidation, updateProfile)


// Exam Subjects

adminRoutes.get('/subjects', passport.authenticate('jwt', {session:false}), viewSubjects)
adminRoutes.post('/subjects/store', passport.authenticate('jwt', {session:false}), subjectCreationValidation, createSubject)
adminRoutes.post('/subjects/update', passport.authenticate('jwt', {session:false}), subjectUpdateValidation, updateSubject)

// Past Questions

adminRoutes.get('/past/questions', passport.authenticate('jwt', {session:false}), viewPastQuestions);
adminRoutes.post('/past/questions/store', passport.authenticate('jwt', {session:false}), upload.single('file'), pastQuestionCreationValidation, storePastQuestions);
adminRoutes.get('/past/questions/details', passport.authenticate('jwt', {session:false}), viewPastQuestion)
adminRoutes.post('/past/questions/update', passport.authenticate('jwt', {session:false}), upload.single('file'), pastQuestionUpdateValidation, updatePastQuestions);
adminRoutes.post('/past/questions/delete', passport.authenticate('jwt', {session:false}), deletePastQuestions)
adminRoutes.get('/past/questions/download', downloadPastQuestions)

// Exams

adminRoutes.get('/exams', passport.authenticate('jwt', {session:false}), viewExams);
adminRoutes.post('/exams/store', passport.authenticate('jwt', {session:false}), examCreationValidation, storeExams);
adminRoutes.post('/exams/update', passport.authenticate('jwt', {session:false}), examUpdateValidation, updateExams);
adminRoutes.get('/exams/details', passport.authenticate('jwt', {session:false}), examDetailValidation, viewDetails);

// Exam Questions
adminRoutes.get('/exams/questions', passport.authenticate('jwt', {session:false}), examQuestionValidation, viewQuestions)
adminRoutes.post('/exams/questions/store', passport.authenticate('jwt', {session:false}), examQuestionCreateValidation, storeQuestions)
adminRoutes.get('/exams/questions/details', passport.authenticate('jwt', {session:false}), examQuestionViewValidation, viewQuestionsDetails)
adminRoutes.post('/exams/questions/update', passport.authenticate('jwt', {session:false}), examQuestionUpdateValidation, updateQuestions)
adminRoutes.post('/exams/questions/delete', passport.authenticate('jwt', {session:false}), examQuestionViewValidation, deleteQuestions)

export default adminRoutes