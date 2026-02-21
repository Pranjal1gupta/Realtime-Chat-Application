import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    editMessage,
    deleteMessage,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState("");
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [messageIdToDelete, setMessageIdToDelete] = useState(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            {message.senderId === authUser._id && (
              <div className="dropdown dropdown-end mb-2">
                <div tabIndex={0} role="button" className="btn btn-xs btn-ghost">
                  ⋮
                </div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <a onClick={() => {
                      setEditingMessageId(message._id);
                      setEditText(message.text);
                    }}>
                      Edit
                    </a>
                  </li>
                  <li>
                    <a onClick={() => {
                      setMessageIdToDelete(message._id);
                      setDeleteConfirmModalOpen(true);
                    }}>Delete</a>
                  </li>
                </ul>
              </div>
            )}
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border border-base-300 shadow-sm">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-[10px] opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            {editingMessageId === message._id ? (
              <div className="chat-bubble bg-base-300 p-3 rounded-2xl">
                <div className="flex gap-2 items-center">
                  <span className="text-sm font-semibold">div:</span>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="input input-bordered input-sm flex-1"
                    placeholder="Edit message..."
                  />
                  <button
                    onClick={() => {
                      editMessage(message._id, editText);
                      setEditingMessageId(null);
                      setEditText("");
                    }}
                    className="btn btn-sm btn-primary"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingMessageId(null);
                      setEditText("");
                    }}
                    className="btn btn-sm btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className={`chat-bubble flex flex-col gap-2 ${
                /^[\p{Emoji_Presentation}\p{Extended_Pictographic}]+$/u.test(message.text?.trim())
                  ? "bg-transparent shadow-none p-0"
                  : `${message.senderId === authUser._id ? "bg-primary text-primary-content" : "bg-base-200 text-base-content"} shadow-sm p-3 rounded-2xl`
              }`}>
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-xl mb-1 shadow-sm border border-base-300/20"
                  />
                )}
                {message.text && (
                  /^[\p{Emoji_Presentation}\p{Extended_Pictographic}]+$/u.test(message.text?.trim()) ? (
                    <p className="text-6xl leading-relaxed">{message.text}</p>
                  ) : (
                    <p className="leading-relaxed">{message.text}</p>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <MessageInput />

      {deleteConfirmModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Delete Message</h3>
            <p className="py-4">Are you sure you want to delete this message? This action cannot be undone.</p>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => {
                  setDeleteConfirmModalOpen(false);
                  setMessageIdToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={async () => {
                  await deleteMessage(messageIdToDelete);
                  setDeleteConfirmModalOpen(false);
                  setMessageIdToDelete(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatContainer;
