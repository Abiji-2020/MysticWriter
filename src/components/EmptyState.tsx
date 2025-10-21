import { Sparkles, Plus, BookOpen } from "lucide-react";
import { Button } from "./ui/button";

interface EmptyStateProps {
  onNewStory: () => void;
}

export function EmptyState({ onNewStory }: EmptyStateProps) {
  return (
    <div className="h-full flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-2xl text-center">
        {/* Icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 dark:from-purple-500/30 dark:to-pink-500/30 flex items-center justify-center border border-purple-500/20 dark:border-purple-500/30 shadow-lg shadow-purple-500/10">
          <BookOpen className="w-12 h-12 text-purple-600 dark:text-purple-400" />
        </div>

        {/* Title */}
        <h2 className="text-foreground mb-3" style={{ fontSize: "1.5rem" }}>
          Welcome to MysticWriter
        </h2>

        {/* Description */}
        <p
          className="text-muted-foreground mb-6 sm:mb-8 max-w-lg mx-auto px-4"
          style={{ fontSize: "0.9375rem", lineHeight: "1.7" }}
        >
          Embark on a collaborative storytelling journey where your creativity
          meets AI imagination. Create your first story and watch as each word
          weaves magic into reality.
        </p>

        {/* CTA Button */}
        <Button
          onClick={onNewStory}
          className="gradient-purple hover:opacity-90 transition-opacity gap-3 px-8 py-6 rounded-full shadow-lg shadow-purple-500/30"
        >
          <Plus className="w-5 h-5" />
          <span style={{ fontSize: "1rem" }}>Create Your First Story</span>
          <Sparkles className="w-5 h-5" />
        </Button>

        {/* Features */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 px-4">
          <div className="glass-card rounded-2xl p-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
            <h4
              className="text-foreground mb-2"
              style={{ fontSize: "0.9375rem" }}
            >
              Collaborative Writing
            </h4>
            <p
              className="text-muted-foreground"
              style={{ fontSize: "0.8125rem" }}
            >
              Write your story and let AI continue the narrative seamlessly
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600 dark:text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h4
              className="text-foreground mb-2"
              style={{ fontSize: "0.9375rem" }}
            >
              Character Creation
            </h4>
            <p
              className="text-muted-foreground"
              style={{ fontSize: "0.8125rem" }}
            >
              Generate AI avatars for your characters with descriptions
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-emerald-600 dark:text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h4
              className="text-foreground mb-2"
              style={{ fontSize: "0.9375rem" }}
            >
              Track Progress
            </h4>
            <p
              className="text-muted-foreground"
              style={{ fontSize: "0.8125rem" }}
            >
              Monitor word count, streaks, and writing analytics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
