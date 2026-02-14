import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hi, how are you?", isSent: false },
  { id: 2, content: "I'm good! How can I help you?", isSent: true }
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen container mx-auto px-4 pt-20 pb-10 max-w-5xl">
      <div className="space-y-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight">Theme</h2>
          <p className="text-base-content/60 text-lg">Choose a theme for your chat interface</p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`
                group flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300
                ${theme === t ? "bg-base-300 ring-2 ring-primary" : "hover:bg-base-200/50 hover:scale-105"}
              `}
              onClick={() => setTheme(t)}
            >
              <div className="relative h-10 w-full rounded-lg overflow-hidden shadow-sm" data-theme={t}>
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1.5">
                  <div className="rounded-sm bg-primary"></div>
                  <div className="rounded-sm bg-secondary"></div>
                  <div className="rounded-sm bg-accent"></div>
                  <div className="rounded-sm bg-neutral"></div>
                </div>
              </div>
              <span className="text-[11px] font-bold truncate w-full text-center uppercase tracking-wider">
                {t}
              </span>
            </button>
          ))}
        </div>

        {/* Preview Section */}
        <div className="pt-4">
          <h3 className="text-2xl font-bold mb-4 tracking-tight">Preview</h3>
          <div className="rounded-2xl border border-base-300 overflow-hidden bg-base-100 shadow-2xl">
            <div className="p-6 bg-base-200">
              <div className="max-w-lg mx-auto">
                {/* Mock Chat UI */}
                <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden border border-base-300">
                  {/* Chat Header */}
                  <div className="px-5 py-4 border-b border-base-300 bg-base-100">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold shadow-inner">
                        AS
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">Abhishek Sharma</h3>
                        <div className="flex items-center gap-1.5">
                          <div className="size-2 rounded-full bg-success animate-pulse" />
                          <p className="text-xs text-base-content/60">Online</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="p-5 space-y-4 min-h-[250px] max-h-[250px] overflow-y-auto bg-base-100/50">
                    {PREVIEW_MESSAGES.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`
                            max-w-[85%] rounded-2xl p-4 shadow-sm transition-all duration-300
                            ${message.isSent ? "bg-primary text-primary-content rounded-tr-none" : "bg-base-200 rounded-tl-none"}
                          `}
                        >
                          <p className="text-sm font-medium leading-relaxed">{message.content}</p>
                          <p
                            className={`
                              text-[10px] mt-2 font-bold
                              ${message.isSent ? "text-primary-content/70 text-right" : "text-base-content/50"}
                            `}
                          >
                            12:00 PM
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="p-5 border-t border-base-300 bg-base-100">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="input input-bordered flex-1 text-sm h-12 rounded-xl focus:input-primary transition-all"
                        placeholder="Type a message..."
                        value="This is a beautiful preview ✨"
                        readOnly
                      />
                      <button className="btn btn-primary h-12 px-6 rounded-xl shadow-lg hover:scale-105 transition-all">
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
