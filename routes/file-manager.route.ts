import { Router } from "express";
import * as fileManagerController from "../controllers/file-manager.controller";
import multer from "multer";

const router = Router();

const upload = multer();

router.post("/upload", upload.array("files"), fileManagerController.upload);

router.patch(
  "/change-file-name",
  upload.none(),
  fileManagerController.changeFileNamePatch
);

router.patch(
  "/delete-file",
  upload.none(),
  fileManagerController.deleteFilePatch
);

router.post(
  "/folder/create",
  upload.none(),
  fileManagerController.createFolderPost
);

router.get("/folder/list", fileManagerController.listFolder);

export default router;
