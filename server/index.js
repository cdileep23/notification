import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import userModel from "./models/user.model.js";
import userRouter from "./routes/user.route.js";
import blogRouter from "./routes/blog.route.js";
import notificationRouter from './routes/notification.route.js'
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

dotenv.config({});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


const userSockets = new Map();

io.on("connection", (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

 
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSockets.set(userId, socket.id);
    console.log(`📝 Mapped user ${userId} to socket ${socket.id}`);
  }

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.roomId = roomId;


    userSockets.set(roomId, socket.id);

    console.log(`Socket ${socket.id} joined room ${roomId}`);
    console.log(`Current rooms for socket:`, [...socket.rooms]);


    socket.emit("room-joined", { roomId, socketId: socket.id });
    
  });

  socket.on("disconnect", () => {
    console.log(
      `❌ Client disconnected: ${socket.id} from room ${
        socket.roomId || "no room"
      }`
    );

   
    for (let [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        console.log(`🗑️ Removed user ${userId} from socket mapping`);
        break;
      }
    }

    if (socket.roomId) {
      socket.leave(socket.roomId);
    }
  });
});

app.set("io", io);
app.use(cors());
app.use(express.json());
app.use("/api/v1", userRouter);
app.use("/api/v1", blogRouter);
app.use('/api/v1', notificationRouter)

// Add debug endpoint to check active connections
app.get("/api/v1/debug/sockets", (req, res) => {
  const activeConnections = Array.from(userSockets.entries()).map(
    ([userId, socketId]) => ({
      userId,
      socketId,
      rooms: io.sockets.sockets.get(socketId)?.rooms || [],
    })
  );

  res.json({
    success: true,
    activeConnections,
    totalConnections: io.sockets.sockets.size,
  });
});

app.post("/api/v1/authenticate-user", async (req, res) => {
  try {
    const { username } = req.body;
    const userExists = await userModel.findOne({ username });

    if (userExists) {
      return res.status(200).json({
        success: true,
        message: "User Authenticated Successfully",
        data: {
          userId: userExists._id,
          username,
        },
      });
    }

    const newUser = await userModel.create({ username });

    return res.status(201).json({
      success: true,
      message: "User Authenticated Successfully",
      data: {
        userId: newUser._id,
        username: newUser.username,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.get("/", (req, res) => {
  res.send("hello from notifications");
});

const startServer = async () => {
  try {
    await connectDB();
    server.listen(1000, () => {
      console.log("✅ Server started At 1000");
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
