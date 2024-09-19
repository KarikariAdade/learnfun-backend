import { Router } from "express";
import {login, registerUser, reVerifyAccount, verifyAccount} from "../../authentication/controllers/authentication.controller";
import {loginVerification, registrationValidation, verificationEmailValidation} from "../../authentication/requests/authentication.request";

const commonRouter = Router()

commonRouter.post('/auth/register', registrationValidation, registerUser)
commonRouter.get('/auth/register/verify/:token', verifyAccount)
commonRouter.post('/auth/register/reverify', verificationEmailValidation, reVerifyAccount)
commonRouter.post('/auth/login', loginVerification, login)

export default commonRouter;