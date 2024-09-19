import { Router } from "express";
import {registerUser, reVerifyAccount, verifyAccount} from "../../authentication/controllers/authentication.controller";
import {registrationValidation, resendVerificationEmail} from "../../authentication/requests/authentication.request";

const commonRouter = Router()

commonRouter.post('/auth/register', registrationValidation, registerUser)
commonRouter.get('/auth/register/verify/:token', verifyAccount)
commonRouter.post('/auth/register/reverify', resendVerificationEmail, reVerifyAccount)

export default commonRouter;