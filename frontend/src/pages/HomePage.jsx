import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import PendingRequests from "../components/PendingRequests";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200 overflow-hidden">
      <PendingRequests />

      {/* Mobile Layout (stacked) */}
      <div className="flex lg:hidden flex-col pt-20 h-full">
        <div className="bg-base-100 w-full flex-1 overflow-hidden flex flex-col">
          {/* Sidebar - Full screen on mobile, hidden when chat selected */}
          {!selectedUser && <Sidebar />}
          
          {/* Chat - Full screen on mobile, shown when user selected */}
          {selectedUser && <ChatContainer />}
        </div>
      </div>

      {/* Desktop Layout (side by side) */}
      <div className="hidden lg:flex items-center justify-center pt-20 px-4 h-full">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
