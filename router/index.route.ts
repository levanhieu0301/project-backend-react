import { Router } from "express";
const router = Router();

import userRouter from "../router/account-user.route"
import authenRouter from "../router/authen.route"

router.use('/user', userRouter);
router.use('/authen', authenRouter);

export default router;