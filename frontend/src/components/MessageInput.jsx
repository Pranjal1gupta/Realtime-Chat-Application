import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Smile, MoreVertical } from "lucide-react";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";

const STICKERS = [
  "👍", "❤️", "😂", "😍", "😮", "😢", "😡", "👏",
  "🎉", "🎊", "🎁", "🌟", "✨", "🔥", "💯", "🚀"
];

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const stickerPickerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { sendMessage, selectedUser, isChatAccepted } = useChatStore();

  const isAccepted = selectedUser ? isChatAccepted(selectedUser._id) : false;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEmojiSelect = (emojiObject) => {
    setText(text + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleStickerSelect = async (sticker) => {
    try {
      await sendMessage({
        text: sticker,
        image: null,
      });
      setShowStickerPicker(false);
    } catch (error) {
      console.error("Failed to send sticker:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    e.currentTarget.blur();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form and close all pickers
      setText("");
      setImagePreview(null);
      setShowEmojiPicker(false);
      setShowStickerPicker(false);
      setShowMobileMenu(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (!isAccepted && selectedUser) {
    return (
      <div className="p-4 w-full flex items-center justify-center">
        <div className="text-center text-base-content/60">
          <p className="font-medium">Chat request not accepted yet</p>
          <p className="text-sm">Wait for {selectedUser.fullName} to accept your request</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="mb-2">
          <EmojiPicker onEmojiClick={handleEmojiSelect} />
        </div>
      )}

      {showStickerPicker && (
        <div ref={stickerPickerRef} className="mb-3 flex flex-wrap gap-2 p-2 bg-base-100 rounded-lg border border-base-300">
          {STICKERS.map((sticker, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleStickerSelect(sticker)}
              className="text-3xl hover:scale-125 transition-transform cursor-pointer"
            >
              {sticker}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-end gap-2">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        <div className="hidden sm:flex gap-2 items-center flex-shrink-0">
          <button
            type="button"
            className={`btn btn-circle btn-sm lg:btn-md
                       ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={18} />
          </button>

          <button
            type="button"
            className="btn btn-circle btn-sm lg:btn-md text-zinc-400 hover:text-primary"
            onClick={() => {
              setShowEmojiPicker(!showEmojiPicker);
              setShowStickerPicker(false);
            }}
          >
            <Smile size={18} />
          </button>

          <button
            type="button"
            className="btn btn-circle btn-sm lg:btn-md text-zinc-400 hover:text-primary"
            onClick={() => {
              setShowStickerPicker(!showStickerPicker);
              setShowEmojiPicker(false);
            }}
          >
            🎨
          </button>
        </div>

        <div className="flex-1">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className={`btn btn-md lg:btn-md btn-circle flex-shrink-0 focus:outline-none transition-all duration-0 ${
            !text.trim() && !imagePreview ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <Send size={18} />
        </button>

        <div className="sm:hidden relative flex-shrink-0" ref={mobileMenuRef}>
          <button
            type="button"
            className="btn btn-circle btn-md"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <MoreVertical size={18} />
          </button>
          {showMobileMenu && (
            <ul className="absolute bottom-full right-0 mb-2 z-50 menu p-2 shadow-lg bg-base-100 rounded-lg w-52 border border-base-300">
              <li>
                <a
                  onClick={() => {
                    fileInputRef.current?.click();
                    setShowMobileMenu(false);
                  }}
                >
                  <Image size={18} />
                  Attachment
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    setShowEmojiPicker(!showEmojiPicker);
                    setShowStickerPicker(false);
                    setShowMobileMenu(false);
                  }}
                >
                  <Smile size={18} />
                  Emoji
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    setShowStickerPicker(!showStickerPicker);
                    setShowEmojiPicker(false);
                    setShowMobileMenu(false);
                  }}
                >
                  <span className="text-lg">🎨</span>
                  Sticker
                </a>
              </li>
            </ul>
          )}
        </div>
      </form>
    </div>
  );
};
export default MessageInput;
