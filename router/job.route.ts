import { Router } from "express";
const router = Router();
import * as jobController from "../controllers/job.controller"

router.get('/detail/:id',jobController.jobDetail);

export default router;