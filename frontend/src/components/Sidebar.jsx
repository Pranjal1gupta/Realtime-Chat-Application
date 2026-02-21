import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, MessageSquare, UserPlus, Bell, Check, X } from "lucide-react";

const Sidebar = () => {
  const {
    getUsers,
    getPendingRequests,
    getAcceptedConnections,
    sendChatRequest,
    acceptChatRequest,
    rejectChatRequest,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    pendingRequests,
    acceptedConnections,
    subscribeToRequests,
    unsubscribeFromRequests,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const authUser = useAuthStore((state) => state.authUser);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
    getPendingRequests();
    getAcceptedConnections();
    subscribeToRequests();
    
    const interval = setInterval(() => {
      getPendingRequests();
    }, 3000);

    return () => {
      clearInterval(interval);
      unsubscribeFromRequests();
    };
  }, [getUsers, getPendingRequests, getAcceptedConnections, subscribeToRequests, unsubscribeFromRequests]);

  const acceptedUserIds = acceptedConnections.map((user) => user._id?.toString());
  const pendingSentRequestIds = pendingRequests
    .filter((req) => {
      const senderId = typeof req.senderId === 'string' ? req.senderId : req.senderId?._id?.toString();
      return senderId === authUser?._id?.toString();
    })
    .map((req) => {
      const receiverId = typeof req.receiverId === 'string' ? req.receiverId : req.receiverId?._id?.toString();
      return receiverId;
    });
  const pendingReceivedRequestIds = pendingRequests
    .filter((req) => {
      const receiverId = typeof req.receiverId === 'string' ? req.receiverId : req.receiverId?._id?.toString();
      return receiverId === authUser?._id?.toString();
    })
    .map((req) => {
      const senderId = typeof req.senderId === 'string' ? req.senderId : req.senderId?._id?.toString();
      return senderId;
    });

  const incomingRequests = pendingRequests.filter((req) => {
    const receiverId = typeof req.receiverId === 'string' ? req.receiverId : req.receiverId?._id?.toString();
    return receiverId === authUser?._id?.toString();
  });

  const outgoingRequests = pendingRequests.filter((req) => {
    const senderId = typeof req.senderId === 'string' ? req.senderId : req.senderId?._id?.toString();
    return senderId === authUser?._id?.toString();
  });

  const discoverUsers = users.filter(
    (user) => {
      const userId = user._id?.toString();
      return (
        !acceptedUserIds.includes(userId) &&
        !pendingSentRequestIds.includes(userId) &&
        !pendingReceivedRequestIds.includes(userId)
      );
    }
  );

  const filteredAcceptedConnections = showOnlineOnly
    ? acceptedConnections.filter((user) => onlineUsers.some(uid => uid === user._id || uid === user._id?.toString()))
    : acceptedConnections;

  const filteredDiscoverUsers = showOnlineOnly
    ? discoverUsers.filter((user) => onlineUsers.some(uid => uid === user._id || uid === user._id?.toString()))
    : discoverUsers;

  useEffect(() => {
    console.log("Sidebar Debug:", {
      authUserId: authUser?._id,
      acceptedConnections: acceptedConnections.length,
      pendingRequests: pendingRequests.length,
      pendingRequestsData: pendingRequests,
      incomingRequests: incomingRequests.length,
      incomingRequestsData: incomingRequests,
      outgoingRequests: outgoingRequests.length,
      discoverUsers: discoverUsers.length,
    });
  }, [acceptedConnections, discoverUsers, pendingRequests, incomingRequests, outgoingRequests, authUser]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="hidden lg:flex items-center gap-3 mb-4 p-3 bg-base-200 rounded-lg">
          <img
            src={authUser?.profilePic || "/avatar.png"}
            alt={authUser?.fullName}
            className="size-10 rounded-full object-cover border-2 border-base-300"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate text-sm">{authUser?.fullName}</p>
            <p className="text-xs text-base-content/60">{authUser?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Users className="size-6 text-primary" />
          <span className="font-semibold hidden lg:block text-lg">Messages</span>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-primary checkbox-sm"
            />
            <span className="text-sm font-medium">Show online only</span>
          </label>
          <span className="text-xs text-base-content/50">
            ({Math.max(0, onlineUsers.length - 1)} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3 flex-1">
        {filteredAcceptedConnections.length > 0 && (
          <>
            <div className="hidden lg:block px-5 py-2 text-xs font-semibold text-base-content/60 uppercase">
              <div className="flex items-center gap-2">
                <MessageSquare className="size-4" />
                <span>People You Are Chatting With</span>
              </div>
            </div>
            {filteredAcceptedConnections.map((user) => (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`
                  w-full p-4 flex items-center gap-4
                  hover:bg-base-200 transition-all duration-200
                  ${selectedUser?._id === user._id ? "bg-base-200 ring-1 ring-inset ring-primary/20" : ""}
                `}
              >
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.fullName}
                    className="size-12 object-cover rounded-full border-2 border-base-100 shadow-sm"
                  />
                  {onlineUsers.includes(user._id) && (
                    <span className="absolute bottom-0 right-0 size-3.5 bg-green-500 rounded-full ring-2 ring-base-100 shadow-sm" />
                  )}
                </div>

                <div className="hidden lg:block text-left min-w-0 flex-1">
                  <div className="font-semibold truncate text-base">{user.fullName}</div>
                  <div className="text-sm text-base-content/60 flex items-center gap-1">
                    {onlineUsers.includes(user._id) ? (
                      <>
                        <span className="size-1.5 bg-green-500 rounded-full" />
                        <span>Online</span>
                      </>
                    ) : (
                      <span>Offline</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </>
        )}

        {incomingRequests.length > 0 && (
          <>
            <div className="hidden lg:block px-5 py-2 text-xs font-semibold text-base-content/60 uppercase mt-4">
              <div className="flex items-center gap-2">
                <Bell className="size-4" />
                <span>Incoming Requests</span>
              </div>
            </div>
            {incomingRequests.map((request) => (
              <div
                key={request._id}
                className="w-full p-4 flex items-center gap-3 hover:bg-base-200 transition-all duration-200 border-l-2 border-warning"
              >
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={request.senderId.profilePic || "/avatar.png"}
                    alt={request.senderId.fullName}
                    className="size-10 object-cover rounded-full border-2 border-base-100 shadow-sm"
                  />
                  {onlineUsers.includes(request.senderId._id) && (
                    <span className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full ring-2 ring-base-100 shadow-sm" />
                  )}
                </div>

                <div className="hidden lg:block text-left min-w-0 flex-1">
                  <div className="font-semibold truncate text-sm">{request.senderId.fullName}</div>
                  <div className="text-xs text-base-content/60">wants to chat</div>
                </div>

                <div className="hidden lg:flex items-center gap-1">
                  <button
                    onClick={() => acceptChatRequest(request._id)}
                    className="p-1.5 bg-success text-success-content rounded hover:bg-success/80 transition-all"
                    title="Accept"
                  >
                    <Check className="size-3.5" />
                  </button>
                  <button
                    onClick={() => rejectChatRequest(request._id)}
                    className="p-1.5 bg-error text-error-content rounded hover:bg-error/80 transition-all"
                    title="Reject"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {outgoingRequests.length > 0 && (
          <>
            <div className="hidden lg:block px-5 py-2 text-xs font-semibold text-base-content/60 uppercase mt-4">
              <div className="flex items-center gap-2">
                <UserPlus className="size-4" />
                <span>Pending Sent Requests</span>
              </div>
            </div>
            {outgoingRequests.map((request) => (
              <div
                key={request._id}
                className="w-full p-4 flex items-center gap-3 hover:bg-base-200 transition-all duration-200 border-l-2 border-info"
              >
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={request.receiverId.profilePic || "/avatar.png"}
                    alt={request.receiverId.fullName}
                    className="size-10 object-cover rounded-full border-2 border-base-100 shadow-sm"
                  />
                  {onlineUsers.includes(request.receiverId._id) && (
                    <span className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full ring-2 ring-base-100 shadow-sm" />
                  )}
                </div>

                <div className="hidden lg:block text-left min-w-0 flex-1">
                  <div className="font-semibold truncate text-sm">{request.receiverId.fullName}</div>
                  <div className="text-xs text-base-content/60">pending...</div>
                </div>
              </div>
            ))}
          </>
        )}

        {filteredDiscoverUsers.length > 0 && (
          <>
            <div className="hidden lg:block px-5 py-2 text-xs font-semibold text-base-content/60 uppercase mt-4">
              <div className="flex items-center gap-2">
                <UserPlus className="size-4" />
                <span>Discover</span>
              </div>
            </div>
            {filteredDiscoverUsers.map((user) => (
              <div
                key={user._id}
                className="w-full p-4 flex items-center gap-4 hover:bg-base-200 transition-all duration-200"
              >
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.fullName}
                    className="size-12 object-cover rounded-full border-2 border-base-100 shadow-sm"
                  />
                  {onlineUsers.includes(user._id) && (
                    <span className="absolute bottom-0 right-0 size-3.5 bg-green-500 rounded-full ring-2 ring-base-100 shadow-sm" />
                  )}
                </div>

                <div className="hidden lg:block text-left min-w-0 flex-1">
                  <div className="font-semibold truncate text-base">{user.fullName}</div>
                  <div className="text-sm text-base-content/60 flex items-center gap-1">
                    {onlineUsers.includes(user._id) ? (
                      <>
                        <span className="size-1.5 bg-green-500 rounded-full" />
                        <span>Online</span>
                      </>
                    ) : (
                      <span>Offline</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => sendChatRequest(user._id)}
                  className="hidden lg:flex ml-auto px-3 py-1.5 bg-primary text-primary-content rounded-lg text-sm font-medium hover:bg-primary/80 transition-all"
                  title="Send Chat Request"
                >
                  <UserPlus className="size-4" />
                </button>
              </div>
            ))}
          </>
        )}

        {filteredAcceptedConnections.length === 0 && filteredDiscoverUsers.length === 0 && incomingRequests.length === 0 && outgoingRequests.length === 0 && (
          <div className="text-center text-base-content/50 py-10 px-4">
            <p className="font-medium">No users found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
