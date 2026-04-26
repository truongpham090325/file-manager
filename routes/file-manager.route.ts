import { Router } from "express";
import * as fileManagerController from "../controllers/file-manager.controller";

const router = Router();

router.post("/upload", fileManagerController.upload);

export default router;
