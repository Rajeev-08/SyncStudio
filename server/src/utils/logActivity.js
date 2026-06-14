import Activity from "../models/Activity.js";

const logActivity = async ({
  projectId,
  userId,
  action,
  details,
}) => {
  await Activity.create({
    projectId,
    userId,
    action,
    details,
  });
};

export default logActivity;