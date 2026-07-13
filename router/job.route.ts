import { Router } from "express";
const router = Router();
import * as jobController from "../controllers/job.controller"
import * as cvValidate from "../validates/cv.validate"
import multer from "multer";
import {storage} from "../helpers/cloudinary.helper"
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if(file.mimetype !== 'application/pdf') {
      cb(null, false);
      return;
    }
    cb(null, true);
  }
});


router.get('/detail/:id',jobController.jobDetail);

router.post(
  '/apply',
  upload.single("fileCV"),
  cvValidate.applyPost,
  jobController.apply);

export default router;