import { Router } from "express";
const router = Router();
import * as userRegisterController from "../controllers/account-user.controller";
import * as userRegisterValidate from "../validates/account-user.validate"

router.post('/register',userRegisterValidate.registerPost ,userRegisterController.userRegister);

router.post('/login',userRegisterValidate.loginPost ,userRegisterController.userLogin);
export default router;