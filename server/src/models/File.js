import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["file", "folder"],
      default: "file",
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      default: null,
    },
    path: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: "javascript",
    },
    content: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

fileSchema.index({ projectId: 1, parentId: 1, name: 1 }, { unique: true });

const File = mongoose.model("File", fileSchema);
export default File;