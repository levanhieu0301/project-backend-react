import { Router } from "express";
const router = Router();

import userRouter from "../router/account-user.route"
import authenRouter from "../router/authen.route"
import companyRouter from "../router/account-company.route"
import companyManageRouter from "./company-manage.route"

router.use('/user', userRouter);
router.use('/authen', authenRouter);
router.use('/company', companyRouter);
router.use('/company-manage', companyManageRouter);

export default router;