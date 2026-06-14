import Project from "../models/Project.js";
import User from "../models/User.js";
import File from "../models/File.js";
import ProjectVersion from "../models/ProjectVersion.js";
import Activity from "../models/Activity.js";
import logActivity from "../utils/logActivity.js";

export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({
      name,
      description,
      owner: req.user.id,
      members: [req.user.id],
    });
    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user.id });
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const inviteMember = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ success: false, message: "Project matching query not discovered" });

    if (!project.members.includes(user._id)) {
      project.members.push(user._id);
      await project.save();
      await logActivity({
        projectId: project._id,
        userId: req.user.id,
        action: "WORKSPACE_COLLABORATOR_ADDED",
        details: user.email,
      });
    }
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const saveProjectVersion = async (req, res) => {
  try {
    const { versionName } = req.body;
    const files = await File.find({ projectId: req.params.projectId });

    const snapshot = files.map((f) => ({
      name: f.name,
      type: f.type,
      parentId: f.parentId,
      path: f.path,
      language: f.language,
      content: f.content,
    }));

    const version = await ProjectVersion.create({
      projectId: req.params.projectId,
      versionName,
      files: snapshot,
      createdBy: req.user.id,
    });

    await logActivity({
      projectId: req.params.projectId,
      userId: req.user.id,
      action: "VERSION_COMMIT",
      details: versionName,
    });

    res.json({ success: true, version });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

export const getProjectVersions = async (req, res) => {
  try {
    const versions = await ProjectVersion.find({ projectId: req.params.projectId }).sort({ createdAt: -1 });
    res.json({ success: true, versions });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

export const restoreVersion = async (req, res) => {
  try {
    const version = await ProjectVersion.findById(req.params.versionId);
    if (!version) return res.status(404).json({ success: false, message: "Commit verification failure" });

    await File.deleteMany({ projectId: version.projectId });

    const restoredFiles = version.files.map((file) => ({
      projectId: version.projectId,
      name: file.name,
      type: file.type || "file",
      parentId: file.parentId || null,
      path: file.path,
      language: file.language,
      content: file.content,
      createdBy: req.user.id,
    }));

    await File.insertMany(restoredFiles);

    await logActivity({
      projectId: version.projectId,
      userId: req.user.id,
      action: "VERSION_ROLLBACK",
      details: version.versionName,
    });

    res.json({ success: true, message: "Project state reverted across global workspace schema components" });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ projectId: req.params.projectId })
      .populate("userId", "username email")
      .sort({ createdAt: -1 });
    res.json({ success: true, activities });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

export const getProjectMembers = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate("members", "username email");
    if (!project) return res.status(404).json({ success: false });
    res.json({ success: true, members: project.members });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};