import { Router } from "express";
const router = Router();
import * as companyController from "../controllers/account-company.controller"
import * as companyValidate from "../validates/account-company.validate"

router.post('/register',companyValidate.registerPost ,companyController.companyRegister);
router.post('/login',companyValidate.loginPost ,companyController.companyLogin);

router.get('/list', companyController.list);
router.get('/detail/:id', companyController.companyDetail);

export default router;