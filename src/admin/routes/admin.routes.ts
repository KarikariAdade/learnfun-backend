import { Router } from "express";
import passport from 'passport';
import {updateProfile, viewProfile } from "../controllers/profile.controller";
import { profileUpdateValidation } from "../requests/profile.request";

const adminRoutes = Router();

// Profile Routes

adminRoutes.get('/profile', passport.authenticate('jwt', {session:false}), viewProfile)
adminRoutes.post('/profile/update', passport.authenticate('jwt', {session:false}), profileUpdateValidation, updateProfile)

export default adminRoutes