import File from "../models/File.js";
import logActivity from "../utils/logActivity.js";

export const createFile = async (req, res) => {
  try {
    const { projectId, name, type, parentId, language } = req.body;

    let computedPath = `/${name}`;
    if (parentId) {
      const parentDir = await File.findById(parentId);
      if (!parentDir) {
        return res.status(404).json({ success: false, message: "Parent workspace node directory not found" });
      }
      computedPath = `${parentDir.path}/${name}`;
    }

    const existingFile = await File.findOne({ projectId, parentId, name });
    if (existingFile) {
      return res.status(400).json({ success: false, message: "A resource with this name already exists in this directory" });
    }

    const file = await File.create({
      projectId,
      name,
      type: type || "file",
      parentId: parentId || null,
      path: computedPath,
      language: language || "javascript",
      content: "",
      createdBy: req.user.id,
    });

    await logActivity({
      projectId,
      userId: req.user.id,
      action: type === "folder" ? "DIRECTORY_CREATED" : "FILE_CREATED",
      details: computedPath,
    });

    res.status(201).json({ success: true, file });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFiles = async (req, res) => {
  try {
    const files = await File.find({ projectId: req.params.projectId }).sort({ type: 1, name: 1 });
    res.json({ success: true, files });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateFile = async (req, res) => {
  try {
    const { content } = req.body;
    const fileId = req.params.fileId;

    const file = await File.findByIdAndUpdate(fileId, { content }, { returnDocument: "after" });
    if (!file) {
      return res.status(404).json({ success: false, message: "File target not found" });
    }

    res.json({ success: true, file });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file) {
      return res.status(404).json({ success: false, message: "Target node not found" });
    }

    if (file.type === "folder") {
      await File.deleteMany({ projectId: file.projectId, path: new RegExp(`^${file.path}(/|$)`) });
    } else {
      await File.findByIdAndDelete(req.params.fileId);
    }

    await logActivity({
      projectId: file.projectId,
      userId: req.user.id,
      action: "RESOURCE_DECEASED",
      details: file.path,
    });

    res.json({ success: true, message: "Resources dropped successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};