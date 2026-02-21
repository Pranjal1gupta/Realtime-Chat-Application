import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  sendChatRequest,
  acceptChatRequest,
  rejectChatRequest,
  getPendingRequests,
  getAcceptedConnections,
} from "../controllers/chatRequest.controller.js";

const router = express.Router();

router.post("/send/:receiverId", protectRoute, sendChatRequest);
router.put("/accept/:requestId", protectRoute, acceptChatRequest);
router.put("/reject/:requestId", protectRoute, rejectChatRequest);
router.get("/pending", protectRoute, getPendingRequests);
router.get("/accepted", protectRoute, getAcceptedConnections);

export default router;
