import { Avatar, AvatarFallback } from "./ui/avatar";
import { Sparkles } from "lucide-react";

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
  return (
    <div className={`mb-6 ${isGenerating ? "animate-pulse" : ""}`}>
      <div className="flex gap-4">
        <div className="flex-shrink-0 pt-1">
          {author === "user" ? (
            <Avatar className="w-10 h-10 ring-2 ring-blue-500/30">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                U
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center ring-2 ring-purple-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-foreground"
              style={{ fontSize: '0.875rem', fontWeight: '500' }}
            >
              {author === "user" ? "You wrote" : "AI continued"}
            </span>
            {timestamp && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                  {timestamp}
                </span>
              </>
            )}
            {author === "ai" && (
              <span
                className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 dark:text-purple-400 text-purple-700"
                style={{ fontSize: '0.625rem' }}
              >
                Creative Mode
              </span>
            )}
          </div>
          <div
            className={`rounded-2xl p-5 ${
              author === "user"
                ? "glass-card"
                : "glass-card bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20"
            }`}
          >
            <p
              className="text-foreground/90 leading-relaxed"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                lineHeight: "1.8",
                fontSize: '1rem',
              }}
            >
              {text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
