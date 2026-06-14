import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createProject,
  getProjects,
  inviteMember,
  saveProjectVersion,
getProjectVersions,
restoreVersion,
getActivities,
getProjectMembers,
} from "../controllers/projectController.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createProject
);

router.get(
  "/",
  authMiddleware,
  getProjects
);

router.post(
  "/:projectId/invite",
  authMiddleware,
  inviteMember
);

router.post(
  "/:projectId/version",
  authMiddleware,
  saveProjectVersion
);

router.get(
  "/:projectId/version",
  authMiddleware,
  getProjectVersions
);


router.post(
  "/restore/:versionId",
  authMiddleware,
  restoreVersion
);

router.get(
  "/:projectId/activity",
  authMiddleware,
  getActivities
);


router.get(
  "/:projectId/members",
  authMiddleware,
  getProjectMembers
);

export default router;