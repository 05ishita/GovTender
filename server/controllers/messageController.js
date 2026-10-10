const Message = require("../models/Message");
const User = require("../models/User");
const Notification = require("../models/Notification");

const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    const otherUser = await User.findById(userId).select(
      "name role companyName"
    );

    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const messages = await Message.find({
      $or: [
        {
          sender: req.user._id,
          receiver: userId,
        },
        {
          sender: userId,
          receiver: req.user._id,
        },
      ],
    })
      .populate("sender", "name role")
      .populate("receiver", "name role")
      .sort({ createdAt: 1 });

    await Message.updateMany(
      {
        sender: userId,
        receiver: req.user._id,
        isRead: false,
      },
      {
        $set: { isRead: true },
      }
    );

    res.json({
      success: true,
      user: otherUser,
      messages,
    });
  } catch (error) {
    console.error("Get conversation error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load conversation.",
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { receiverId, message, tenderId, applicationId } =
      req.body;

    if (!receiverId || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Receiver and message are required.",
      });
    }

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found.",
      });
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      tender: tenderId || null,
      application: applicationId || null,
      message: message.trim(),
    });

    const populatedMessage = await Message.findById(
      newMessage._id
    )
      .populate("sender", "name role")
      .populate("receiver", "name role");

    await Notification.create({
      user: receiverId,
      type: "message",
      title: "New message",
      message: `${req.user.name} sent you a new message.`,
      link: `/messages/${req.user._id}`,
    });

    res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    console.error("Send message error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to send message.",
    });
  }
};

const getMyConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id },
      ],
    })
      .populate("sender", "name role")
      .populate("receiver", "name role")
      .sort({ createdAt: -1 });

    const conversations = [];
    const seen = new Set();

    for (const message of messages) {
      const otherUser =
        String(message.sender._id) === String(req.user._id)
          ? message.receiver
          : message.sender;

      const otherId = String(otherUser._id);

      if (!seen.has(otherId)) {
        seen.add(otherId);

        const unreadCount = await Message.countDocuments({
          sender: otherUser._id,
          receiver: req.user._id,
          isRead: false,
        });

        conversations.push({
          user: otherUser,
          lastMessage: message,
          unreadCount,
        });
      }
    }

    res.json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Get conversations error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load conversations.",
    });
  }
};

module.exports = {
  getConversation,
  sendMessage,
  getMyConversations,
};