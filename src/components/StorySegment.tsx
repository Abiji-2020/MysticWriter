import { Avatar, AvatarFallback } from "./ui/avatar";
import { Sparkles, User } from "lucide-react";

interface StorySegmentProps {
  text: string;
  author: "user" | "ai";
  isGenerating?: boolean;
  timestamp?: string;
}

export function StorySegment({
  text,
  author,
  isGenerating = false,
  timestamp,
}: StorySegmentProps) {
  const isUser = author === "user";

  return (
    <div
      className={`mb-8 flex ${isUser ? "justify-end" : "justify-start"} ${isGenerating ? "animate-pulse" : ""}`}
    >
      <div
        className={`flex gap-4 max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"}`}
      >
        {/* Avatar */}
        <div className="flex-shrink-0 pt-1">
          {isUser ? (
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20">
              <User className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 dark:shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Message Content */}
        <div
          className={`flex-1 min-w-0 ${isUser ? "items-end" : "items-start"} flex flex-col`}
        >
          {/* Header */}
          <div
            className={`flex items-center gap-2 mb-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
          >
            <span
              className="text-foreground"
              style={{ fontSize: "0.8125rem", fontWeight: "600" }}
            >
              {isUser ? "You" : "AI Writer"}
            </span>
            {timestamp && (
              <>
                <span className="text-muted-foreground">•</span>
                <span
                  className="text-muted-foreground"
                  style={{ fontSize: "0.75rem" }}
                >
                  {timestamp}
                </span>
              </>
            )}
          </div>

          {/* Message Bubble */}
          <div
            className={`rounded-3xl p-6 shadow-lg transition-all ${
              isUser
                ? "bg-gradient-to-br from-blue-500/90 to-cyan-500/90 dark:from-blue-600/40 dark:to-cyan-600/40 text-white dark:text-blue-50 shadow-blue-500/20 dark:shadow-blue-500/10 border border-blue-400/20 dark:border-blue-500/30"
                : "glass-card bg-gradient-to-br from-purple-500/5 to-pink-500/5 dark:from-purple-500/10 dark:to-pink-500/10 border-purple-500/10 dark:border-purple-500/20 shadow-purple-500/10 dark:shadow-purple-500/5"
            }`}
          >
            <p
              className={`leading-relaxed ${
                isUser ? "text-white dark:text-blue-50" : "text-foreground/95"
              }`}
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                lineHeight: "1.8",
                fontSize: "1rem",
              }}
            >
              {text}
            </p>
          </div>

          {/* AI Badge */}
          {!isUser && (
            <div className="mt-2 flex items-center gap-2">
              <span
                className="px-3 py-1 rounded-full glass-card bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/20 dark:border-purple-500/30 dark:text-purple-300 text-purple-700 shadow-sm"
                style={{ fontSize: "0.6875rem", fontWeight: "500" }}
              >
                ✨ AI Generated
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
