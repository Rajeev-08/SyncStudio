import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createFile,
  getFiles,
  updateFile,
  deleteFile,

} from "../controllers/fileController.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createFile
);

router.get(
  "/:projectId",
  authMiddleware,
  getFiles
);

router.put(
  "/:fileId",
  authMiddleware,
  updateFile
);

router.delete(
  "/:fileId",
  authMiddleware,
  deleteFile
);



export default router;