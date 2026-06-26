import { Router } from "express";
const router = Router();
import * as companyController from "../controllers/account-company.controller"
import * as companyValidate from "../validates/account-company.validate"

router.post('/register',companyValidate.registerPost ,companyController.companyRegister);

export default router;