import { Router } from "express";
const router = Router();
import * as userController from "../controllers/account-user.controller";
import * as userValidate from "../validates/account-user.validate"
import * as authMiddleware from "../middlewares/auth.middleware"
import multer from "multer";
import {storage} from "../helpers/cloudinary.helper"
const upload = multer({ storage: storage });

router.post('/register',userValidate.registerPost ,userController.userRegister);
router.get('/logout' ,userController.userLogout);
router.post('/login',userValidate.loginPost ,userController.userLogin);
router.patch('/profile',authMiddleware.verifyTokenUser,upload.single('avatar'), userController.profile)
router.get(
  '/cv/list', 
  authMiddleware.verifyTokenUser,
  userController.listCV
);

export default router;