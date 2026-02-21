import ChatRequest from "../models/chatRequest.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const sendChatRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId } = req.params;

    if (senderId.toString() === receiverId) {
      return res.status(400).json({ message: "Cannot send request to yourself" });
    }

    const receiverExists = await User.findById(receiverId);
    if (!receiverExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingPendingRequest = await ChatRequest.findOne({
      $or: [
        { senderId, receiverId, status: "pending" },
        { senderId: receiverId, receiverId: senderId, status: "pending" },
      ],
    });

    if (existingPendingRequest) {
      return res.status(400).json({ message: "Request already pending" });
    }

    const acceptedRequest = await ChatRequest.findOne({
      $or: [
        { senderId, receiverId, status: "accepted" },
        { senderId: receiverId, receiverId: senderId, status: "accepted" },
      ],
    });

    if (acceptedRequest) {
      return res.status(400).json({ message: "You are already connected with this user" });
    }

    let chatRequest = await ChatRequest.findOne({
      $or: [
        { senderId, receiverId, status: "rejected" },
        { senderId: receiverId, receiverId: senderId, status: "rejected" },
      ],
    });

    if (chatRequest) {
      chatRequest.status = "pending";
      chatRequest.senderId = senderId;
      chatRequest.receiverId = receiverId;
      await chatRequest.save();
    } else {
      chatRequest = new ChatRequest({
        senderId,
        receiverId,
        status: "pending",
      });
      await chatRequest.save();
    }

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newChatRequest", {
        _id: chatRequest._id,
        senderId,
        receiverId,
        status: "pending",
        createdAt: chatRequest.createdAt,
      });
    }

    res.status(201).json(chatRequest);
  } catch (error) {
    console.error("Error in sendChatRequest: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const acceptChatRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { requestId } = req.params;

    const chatRequest = await ChatRequest.findById(requestId);

    if (!chatRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (chatRequest.receiverId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    chatRequest.status = "accepted";
    await chatRequest.save();

    const senderSocketId = getReceiverSocketId(chatRequest.senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("chatRequestAccepted", {
        _id: chatRequest._id,
        senderId: chatRequest.senderId,
        receiverId: chatRequest.receiverId,
        status: "accepted",
      });
    }

    res.status(200).json(chatRequest);
  } catch (error) {
    console.error("Error in acceptChatRequest: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const rejectChatRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { requestId } = req.params;

    const chatRequest = await ChatRequest.findById(requestId);

    if (!chatRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (chatRequest.receiverId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    chatRequest.status = "rejected";
    await chatRequest.save();

    const senderSocketId = getReceiverSocketId(chatRequest.senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("chatRequestRejected", {
        _id: chatRequest._id,
        senderId: chatRequest.senderId,
        receiverId: chatRequest.receiverId,
        status: "rejected",
      });
    }

    res.status(200).json(chatRequest);
  } catch (error) {
    console.error("Error in rejectChatRequest: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const pendingRequests = await ChatRequest.find({
      $or: [
        { receiverId: userId, status: "pending" },
        { senderId: userId, status: "pending" },
      ],
    }).populate("senderId", "-password").populate("receiverId", "-password");

    res.status(200).json(pendingRequests);
  } catch (error) {
    console.error("Error in getPendingRequests: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAcceptedConnections = async (req, res) => {
  try {
    const userId = req.user._id;

    const acceptedRequests = await ChatRequest.find({
      $or: [
        { senderId: userId, status: "accepted" },
        { receiverId: userId, status: "accepted" },
      ],
    }).populate(
      "senderId receiverId",
      "-password"
    );

    const connectedUsers = acceptedRequests.map((req) => {
      return req.senderId._id.toString() === userId.toString()
        ? req.receiverId
        : req.senderId;
    });

    res.status(200).json(connectedUsers);
  } catch (error) {
    console.error("Error in getAcceptedConnections: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
