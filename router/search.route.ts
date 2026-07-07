import { Router } from "express";
const router = Router();
import * as searchController from "../controllers/search.controller"

router.get('/',searchController.language);

export default router;