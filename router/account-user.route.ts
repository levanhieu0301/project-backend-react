import { Router } from "express";
const router = Router();
import * as userController from "../controllers/account-user.controller";
import * as userValidate from "../validates/account-user.validate"

router.post('/register',userValidate.registerPost ,userController.userRegister);
router.get('/logout' ,userController.userLogout);

router.post('/login',userValidate.loginPost ,userController.userLogin);
export default router;