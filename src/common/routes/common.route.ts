import { Router } from "express";
import {
    forgotPassword,
    login,
    profile,
    registerUser, resetPassword,
    reVerifyAccount,
    verifyAccount
} from "../../authentication/controllers/authentication.controller";

import {
    loginVerification,
    passwordForgotValidation,
    passwordResetValidation,
    registrationValidation,
    verificationEmailValidation
} from "../../authentication/requests/authentication.request";


const commonRouter = Router()

commonRouter.post('/auth/register', registrationValidation, registerUser)
commonRouter.get('/auth/register/verify/:token', verifyAccount)
commonRouter.post('/auth/register/reverify', verificationEmailValidation, reVerifyAccount)
commonRouter.post('/auth/login', loginVerification, login)
commonRouter.post('/auth/password/forgot', passwordForgotValidation, forgotPassword)
commonRouter.post('/auth/password/reset/:token', passwordResetValidation, resetPassword)



export default commonRouter;