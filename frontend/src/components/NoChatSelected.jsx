import { MessageCircle } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce shadow-lg ring-1 ring-primary/20"
            >
              <MessageCircle className="w-8 h-8 text-primary " />
            </div>
            {/* Decorative circles */}
            <div className="absolute -top-2 -right-2 size-4 bg-primary/20 rounded-full blur-sm animate-pulse" />
            <div className="absolute -bottom-1 -left-1 size-3 bg-primary/30 rounded-full blur-xs" />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight">Welcome to <span className="text-primary">Hola Amigo</span></h2>
          <p className="text-base-content/60 text-lg max-w-sm mx-auto">
            Select a conversation from the sidebar to start chatting with your friends
          </p>
        </div>
        
        <div className="pt-4">
          <div className="badge badge-outline badge-lg py-4 px-6 text-base-content/50 border-base-300">
            Pick a contact to get started
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
