import { Router } from "express";
import passport from 'passport';
import path from "path";
import multer from "multer";

const studentRoute = Router();

const UPLOAD_DIR = path.join(__dirname, 'uploads', 'fixed_directory');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
    },
})


export default studentRoute