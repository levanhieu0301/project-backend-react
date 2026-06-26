import { Router } from "express";
const router = Router();
import * as authenController from "../controllers/authen.controller";


router.get('/check',authenController.authen);

export default router;