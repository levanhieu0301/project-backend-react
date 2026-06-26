import { Router } from "express";
const router = Router();

import userRouter from "../router/account-user.route"
import authenRouter from "../router/authen.route"
import companyRouter from "../router/account-company.route"

router.use('/user', userRouter);
router.use('/authen', authenRouter);
router.use('/company', companyRouter);

export default router;