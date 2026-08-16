import mongoose from "mongoose";
import User from "../models/User.js";
import Message from "../models/Message.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = new mongoose.Types.ObjectId(req.user._id);

    const users = await User.aggregate([
      // Exclude the logged-in user
      { $match: { _id: { $ne: loggedInUserId } } },
      // Lookup the last message between loggedInUser and this contact
      {
        $lookup: {
          from: "messages",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $and: [
                        { $eq: ["$senderId", loggedInUserId] },
                        { $eq: ["$receiverId", "$$userId"] },
                      ],
                    },
                    {
                      $and: [
                        { $eq: ["$senderId", "$$userId"] },
                        { $eq: ["$receiverId", loggedInUserId] },
                      ],
                    },
                  ],
                },
              },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
          ],
          as: "lastMessage",
        },
      },
      // Extract the last message's createdAt time
      {
        $addFields: {
          lastMessageTime: { $arrayElemAt: ["$lastMessage.createdAt", 0] },
        },
      },
      // Sort: users with recent chats first, then alphabetically by name
      { $sort: { lastMessageTime: -1, fullName: 1 } },
      // Project out the password and the lookup array
      {
        $project: {
          password: 0,
          lastMessage: 0,
        },
      },
    ]);

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Check block status before sending
    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    if (!receiver || !sender) {
      return res.status(404).json({ message: "User not found" });
    }

    if (sender.blockedUsers.includes(receiverId)) {
      return res.status(400).json({ message: "You have blocked this user" });
    }

    if (receiver.blockedUsers.includes(senderId)) {
      return res.status(400).json({ message: "This user has blocked you" });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image,
    });

    await newMessage.save();

    // Send real-time message via socket.io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const clearChat = async (req, res) => {
  try {
    const { id: userToClearId } = req.params;
    const myId = req.user._id;

    await Message.deleteMany({
      $or: [
        { senderId: myId, receiverId: userToClearId },
        { senderId: userToClearId, receiverId: myId },
      ],
    });

    res.status(200).json({ message: "Chat cleared successfully" });
  } catch (error) {
    console.log("Error in clearChat controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const toggleBlockUser = async (req, res) => {
  try {
    const { id: userToBlockId } = req.params;
    const myId = req.user._id;

    const user = await User.findById(myId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isBlocked = user.blockedUsers.includes(userToBlockId);

    if (isBlocked) {
      user.blockedUsers = user.blockedUsers.filter((id) => id.toString() !== userToBlockId);
    } else {
      user.blockedUsers.push(userToBlockId);
    }

    await user.save();

    res.status(200).json({
      message: isBlocked ? "User unblocked successfully" : "User blocked successfully",
      blockedUsers: user.blockedUsers,
    });
  } catch (error) {
    console.log("Error in toggleBlockUser controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
