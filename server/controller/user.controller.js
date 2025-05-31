import notificationModel from "../models/notification.model.js";
import userModel from "../models/user.model.js";


export const getUsersNotFollowing = async (req, res) => {
  try {
    const currentUserId = req.params.userId; 

    const currentUser = await userModel.findById(currentUserId);

    if (!currentUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    
    const excludedIds = [...currentUser.followers, currentUserId];

    const notFollowingUsers = await userModel
      .find({
        _id: { $nin: excludedIds },
      })
      .select("_id username");

    return res.status(200).json({ success: true, users: notFollowingUsers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const followUser = async (req, res) => {
  try {
    const { userIdToFollow } = req.body;
    const currentUserId = req.params.userId;
    const io = req.app.get("io");

    console.log(
      `🚀 Follow request: ${currentUserId} wants to follow ${userIdToFollow}`
    );

    if (currentUserId === userIdToFollow) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself.",
      });
    }

    const currentUser = await userModel.findById(currentUserId);
    const userToFollow = await userModel.findById(userIdToFollow);

    if (!currentUser || !userToFollow) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const alreadyFollowing =
      currentUser.followers.includes(userIdToFollow) &&
      userToFollow.followers.includes(currentUserId);

    if (alreadyFollowing) {
      return res.status(400).json({
        success: false,
        message: "Already following each other.",
      });
    }

    if (!currentUser.followers.includes(userIdToFollow)) {
      currentUser.followers.push(userIdToFollow);
    }
    if (!userToFollow.followers.includes(currentUserId)) {
      userToFollow.followers.push(currentUserId);
    }

    await currentUser.save();
    await userToFollow.save();

    const message = `${currentUser.username} started following you`;

    const newNotification = await notificationModel.create({
      message,
      fromUserId: currentUser._id,
      toUserId: userToFollow._id,
    });

    console.log("📧 Created notification:", newNotification);

    const targetRoomId = userToFollow._id.toString();
    console.log("🎯 Target room ID:", targetRoomId);

    // Check if target room has any clients
    const room = io.sockets.adapter.rooms.get(targetRoomId);
    console.log(
      "🏠 Room info:",
      room ? `${room.size} clients` : "Room not found"
    );

    if (room && room.size > 0) {
      console.log("📡 Emitting to room:", targetRoomId);
      io.to(targetRoomId).emit("push-notification", {
        message,
        from: currentUser.username,
        timestamp: new Date().toISOString(),
        notificationId: newNotification._id,
      });
      console.log("✅ Notification sent successfully");
    } else {
      console.log(
        "⚠️ No clients in target room, notification saved but not sent"
      );
    }

    return res.status(200).json({
      success: true,
      message: "Followed successfully.",
      notification: {
        sent: room && room.size > 0,
        targetRoom: targetRoomId,
        clientsInRoom: room ? room.size : 0,
      },
    });
  } catch (error) {
    console.error("❌ Follow error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
