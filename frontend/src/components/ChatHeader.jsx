import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-3 border-b border-base-300 bg-base-100/50 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} className="rounded-full object-cover" />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-semibold text-base">{selectedUser.fullName}</h3>
            <p className="text-xs text-base-content/60 flex items-center gap-1">
              {onlineUsers.includes(selectedUser._id) ? (
                <>
                  <span className="size-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Online</span>
                </>
              ) : (
                <span>Offline</span>
              )}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button 
          onClick={() => setSelectedUser(null)}
          className="btn btn-sm btn-circle btn-ghost hover:bg-base-200 transition-colors"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
