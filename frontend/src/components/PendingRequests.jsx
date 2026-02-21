import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Check, X, Bell } from "lucide-react";

const PendingRequests = () => {
  const { getPendingRequests, pendingRequests, acceptChatRequest, rejectChatRequest } =
    useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getPendingRequests();
  }, [getPendingRequests]);

  const incomingRequests = pendingRequests.filter((req) => req.receiverId._id === authUser?._id);

  if (incomingRequests.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm">
      <div className="bg-base-100 rounded-lg shadow-lg border border-base-300 overflow-hidden">
        <div className="bg-primary text-primary-content p-4 flex items-center gap-2">
          <Bell className="size-5" />
          <h3 className="font-semibold">Incoming Chat Requests</h3>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {incomingRequests.map((request) => (
            <div
              key={request._id}
              className="p-4 border-b border-base-200 last:border-b-0 flex items-center gap-3"
            >
              <img
                src={request.senderId.profilePic || "/avatar.png"}
                alt={request.senderId.fullName}
                className="size-10 rounded-full object-cover border border-base-300"
              />

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{request.senderId.fullName}</p>
                <p className="text-xs text-base-content/60">wants to chat with you</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => acceptChatRequest(request._id)}
                  className="p-2 bg-success text-success-content rounded-lg hover:bg-success/80 transition-all"
                  title="Accept"
                >
                  <Check className="size-4" />
                </button>
                <button
                  onClick={() => rejectChatRequest(request._id)}
                  className="p-2 bg-error text-error-content rounded-lg hover:bg-error/80 transition-all"
                  title="Reject"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PendingRequests;
