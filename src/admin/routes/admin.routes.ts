import { Router } from "express";
import passport from 'passport';
import {updateProfile, viewProfile } from "../controllers/profile.controller";
import { profileUpdateValidation } from "../requests/profile.request";
import {createSubject, updateSubject, viewSubjects } from "../controllers/subjects.controller";
import { subjectCreationValidation, subjectUpdateValidation } from "../requests/subjects.request";
import {storePastQuestions, viewPastQuestions } from "../controllers/past_questions.controller";
import multer from 'multer'
import path from "path";
import fs from 'fs';
import { pastQuestionCreationValidation } from "../requests/past_questions.request";

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

export default adminRoutes