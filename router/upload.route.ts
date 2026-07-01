import { Router } from "express";
const router = Router();
import * as uploadController from "../controllers/upload.controller"
import multer from "multer";
import {storage} from "../helpers/cloudinary.helper"
const upload = multer({ storage: storage });

router.post('/image', upload.single("file"),uploadController.image);

export default router;