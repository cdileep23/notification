import blogModel from "../models/blog.model.js";
import notificationModel from "../models/notification.model.js";
import userModel from "../models/user.model.js";



export const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { userId } = req.params;
  const io = req.app.get("io");
    if (!title || !content) {
      return res
        .status(400)
        .json({ success: false, message: "Title and content are required." });
    }

    const newBlog = await blogModel.create({
      title,
      content,
      userId,
    });

    // ✅ Fetch blog creator and their followers
    const blogAuthor = await userModel.findById(userId).populate("followers");
    if (!blogAuthor) {
      return res
        .status(404)
        .json({ success: false, message: "Author not found" });
    }

    const notificationPromises = blogAuthor.followers.map(async (follower) => {
      const message = `${blogAuthor.username} posted a new blog: "${title}"`;

      
      const newNotification = await notificationModel.create({
        message,
        fromUserId: userId,
        toUserId:follower._id
      });

      console.log("📧 Created notification:", newNotification);

      // ✅ Send notification to follower's room
      const targetRoomId = follower._id.toString();
      const room = io.sockets.adapter.rooms.get(targetRoomId);
      console.log(
        "🏠 Room info:",
        room ? `${room.size} clients` : "Room not found"
      );

      if (room && room.size > 0) {
        console.log("📡 Emitting to room:", targetRoomId);
        io.to(targetRoomId).emit("push-notification", {
          message,
          from: blogAuthor.username,
          timestamp: new Date().toISOString(),
          notificationId: newNotification._id,
        });
        console.log("✅ Notification sent successfully");
      } else {
        console.log(
          "⚠️ No clients in target room, notification saved but not sent"
        );
      }
    });

    await Promise.all(notificationPromises); // wait for all notifications

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.error("Create blog error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const getBlogsByUser = async (req, res) => {
  try {
    

    const blogs = await blogModel
      .find()
      .sort({ createdAt: -1 })
      .populate("userId", "username");;

    res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.error("Get blogs error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
