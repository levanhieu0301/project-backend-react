import { Router } from "express";
const router = Router();
import * as userRegisterController from "../controllers/account-user.controller";
import * as userRegisterValidate from "../validates/account-user.validate"

router.post('/register',userRegisterValidate.registerPost ,userRegisterController.userRegister);

export default router;