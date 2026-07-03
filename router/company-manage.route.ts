import { Router } from "express";
const router = Router();
import * as companyManageController from "../controllers/company-manage.controller"
import * as authMiddleware from "../middlewares/auth.middleware"
import multer from "multer";
import {storage} from "../helpers/cloudinary.helper"
const upload = multer({ storage: storage });

router.get('/cities',companyManageController.cities);
router.patch('/profile',authMiddleware.verifyTokenCompany,upload.single("avatar"),companyManageController.profile);
router.post(
  '/job/create',
  authMiddleware.verifyTokenCompany,
  upload.array("images", 8),
  companyManageController.create);
router.post(
  '/job/list',
  authMiddleware.verifyTokenCompany,
  companyManageController.list);
router.get(
  '/job/edit/:id',
  authMiddleware.verifyTokenCompany,
  companyManageController.edit);
router.patch(
  '/job/edit/:id',
  authMiddleware.verifyTokenCompany,
  upload.array("images", 8),
  companyManageController.editPatch);
export default router;