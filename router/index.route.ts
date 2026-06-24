import { Router } from "express";
const router = Router();

import userRouter from "../router/account-user.route"

router.use('/user', userRouter);

export default router;