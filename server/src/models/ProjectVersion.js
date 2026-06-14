import mongoose from "mongoose";

const projectVersionSchema =
  new mongoose.Schema(
    {
      projectId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
      },

      versionName: {
        type: String,
        required: true,
      },

      files: [
        {
          name: String,
          path: String,
          language: String,
          content: String,
        },
      ],

      createdBy: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    {
      timestamps: true,
    }
  );

const ProjectVersion =
  mongoose.model(
    "ProjectVersion",
    projectVersionSchema
  );

export default ProjectVersion;