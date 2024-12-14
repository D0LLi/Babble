const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
app.use(express.json());

// Please note that ajv and ajv-errors need to be installed separately, as they are not bundled with resolvers
connectDB();

app.get("/", (req, res) => {
  // Handles HTTP GET requests at root path and sends a response.

  res.send("API is Called!!");
}); //SIMPLE API CALLED

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use(notFound);
app.use(errorHandler);

const server = app.listen(5000, console.log("Server started on PORT 5000!!"));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  // Handles Socket.io connections.

  console.log("Connected to Socket.io !!");

  socket.on("setup", (userData) => {
    // Handles incoming "setup" messages from clients and joins users to rooms based on
    // their IDs, then sends "connected" events to clients.

    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    // Handles the "join chat" event on a WebSocket connection.

    socket.join(room);
    console.log("Room joined: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    // Broadcasts new messages to connected clients.

    let chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not found !!");
    chat.users.forEach((user) => {
      // Broadcasts new message to all users except sender.

      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message received", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    // Unsubscribes and removes the user from the room when the "setup" event occurs.

    console.log("USER DISCONNECTED !");
    socket.leave(userData._id);
  });
});
