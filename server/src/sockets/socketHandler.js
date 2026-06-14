const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`Connection established: ${socket.id}`);

    socket.on("join-project", (projectId) => {
      socket.join(projectId);
      console.log(`Socket ${socket.id} assigned to project workspace: ${projectId}`);
    });

    socket.on("file-edit", (data) => {
      // Broadcast operational updates to everyone else in the project room
      socket.to(data.projectId).emit("file-sync-receive", {
        fileId: data.fileId,
        content: data.content,
        userId: data.userId,
        username: data.username,
      });
    });

    socket.on("cursor-move", (data) => {
      socket.to(data.projectId).emit("cursor-sync-receive", {
        fileId: data.fileId,
        userId: data.userId,
        username: data.username,
        cursor: data.cursor,
      });
    });

    socket.on("disconnect", () => {
      console.log(`Connection dropped: ${socket.id}`);
    });
  });
};

export default socketHandler;