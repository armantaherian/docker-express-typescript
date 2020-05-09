import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { checkJwt } from "../middlewares/checkJwt";

import * as UploaderController from '../controllers/uploader';

const router = Router();

router.get('/', UploaderController.home);
router.get('/list', UploaderController.list);
router.get('/download/:id', UploaderController.download);
router.post('/upload', UploaderController.upload);

export default router;
