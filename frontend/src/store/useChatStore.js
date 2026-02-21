import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  pendingRequests: [],
  acceptedConnections: [],
  isPendingRequestsLoading: false,
  isAcceptedConnectionsLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getPendingRequests: async () => {
    set({ isPendingRequestsLoading: true });
    try {
      const res = await axiosInstance.get("/chat-requests/pending");
      console.log("getPendingRequests response:", res.data);
      set({ pendingRequests: res.data });
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    } finally {
      set({ isPendingRequestsLoading: false });
    }
  },

  getAcceptedConnections: async () => {
    set({ isAcceptedConnectionsLoading: true });
    try {
      const res = await axiosInstance.get("/chat-requests/accepted");
      set({ acceptedConnections: res.data });
    } catch (error) {
      console.error("Error fetching accepted connections:", error);
    } finally {
      set({ isAcceptedConnectionsLoading: false });
    }
  },

  sendChatRequest: async (receiverId) => {
    try {
      const res = await axiosInstance.post(`/chat-requests/send/${receiverId}`);
      await get().getPendingRequests();
      await get().getAcceptedConnections();
      toast.success("Chat request sent successfully!");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
    }
  },

  acceptChatRequest: async (requestId) => {
    try {
      const res = await axiosInstance.put(`/chat-requests/accept/${requestId}`);
      get().getPendingRequests();
      get().getAcceptedConnections();
      toast.success("Request accepted");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept request");
    }
  },

  rejectChatRequest: async (requestId) => {
    try {
      const res = await axiosInstance.put(`/chat-requests/reject/${requestId}`);
      get().getPendingRequests();
      toast.success("Request rejected");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject request");
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  subscribeToRequests: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newChatRequest", () => {
      get().getPendingRequests();
    });

    socket.on("chatRequestAccepted", () => {
      get().getAcceptedConnections();
      get().getPendingRequests();
    });

    socket.on("chatRequestRejected", () => {
      get().getPendingRequests();
    });
  },

  unsubscribeFromRequests: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newChatRequest");
    socket.off("chatRequestAccepted");
    socket.off("chatRequestRejected");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  isChatAccepted: (selectedUserId) => {
    const { acceptedConnections } = get();
    return acceptedConnections.some((user) => user._id === selectedUserId);
  },
}));
