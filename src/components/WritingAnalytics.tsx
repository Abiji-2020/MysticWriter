import { FileText, Users, Flame } from "lucide-react";
import { Progress } from "./ui/progress";

interface WritingAnalyticsProps {
  totalWords: number;
  wordsToday: number;
  activeCharacters: number;
  contributionPercentage: number;
  streakDays: number;
}

export function WritingAnalytics({
  totalWords,
  wordsToday,
  activeCharacters,
  contributionPercentage,
  streakDays,
}: WritingAnalyticsProps) {
  return (
    <div className="p-6 space-y-4">
      <h3 className="text-foreground">Writing Analytics</h3>

      <div className="grid grid-cols-2 gap-3">
        {/* Total Words Card */}
        <div className="glass-card rounded-2xl p-4 space-y-2 hover:bg-card/30 transition-all">
          <div className="flex items-center justify-between">
            <span
              className="text-muted-foreground"
              style={{ fontSize: "0.75rem" }}
            >
              Total Words
            </span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center ring-1 ring-blue-500/30">
              <FileText className="w-4 h-4 dark:text-blue-400 text-blue-600" />
            </div>
          </div>
          <div>
            <div
              className="text-foreground"
              style={{ fontSize: "1.5rem", fontWeight: "600" }}
            >
              {totalWords.toLocaleString()}
            </div>
            <div
              className="dark:text-emerald-400 text-emerald-600"
              style={{ fontSize: "0.75rem" }}
            >
              +{wordsToday} today
            </div>
          </div>
        </div>

        {/* Characters Card */}
        <div className="glass-card rounded-2xl p-4 space-y-2 hover:bg-card/30 transition-all">
          <div className="flex items-center justify-between">
            <span
              className="text-muted-foreground"
              style={{ fontSize: "0.75rem" }}
            >
              Characters
            </span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center ring-1 ring-purple-500/30">
              <Users className="w-4 h-4 dark:text-purple-400 text-purple-600" />
            </div>
          </div>
          <div>
            <div
              className="text-foreground"
              style={{ fontSize: "1.5rem", fontWeight: "600" }}
            >
              {activeCharacters}
            </div>
            <div
              className="dark:text-blue-400 text-blue-600"
              style={{ fontSize: "0.75rem" }}
            >
              Active
            </div>
          </div>
        </div>
      </div>

      {/* Contribution Progress */}
      <div className="glass-card rounded-2xl p-4 space-y-3 hover:bg-card/30 transition-all">
        <div className="flex items-center justify-between">
          <span
            className="text-muted-foreground"
            style={{ fontSize: "0.75rem" }}
          >
            Your Contribution
          </span>
          <span
            className="text-foreground"
            style={{ fontSize: "0.875rem", fontWeight: "600" }}
          >
            {contributionPercentage}%
          </span>
        </div>
        <div className="relative h-2 rounded-full overflow-hidden bg-secondary/30">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
            style={{
              width: `${contributionPercentage}%`,
              background: "linear-gradient(90deg, #3B82F6 0%, #A855F7 100%)",
              boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)",
            }}
          />
        </div>
      </div>

      {/* Writing Streak */}
      <div className="glass-card rounded-2xl p-4 hover:bg-card/30 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-muted-foreground"
            style={{ fontSize: "0.75rem" }}
          >
            Writing Streak
          </span>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center ring-1 ring-orange-500/30">
            <Flame className="w-4 h-4 dark:text-orange-400 text-orange-600" />
          </div>
        </div>
        <div>
          <div className="text-foreground mb-1">
            <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>
              {streakDays}
            </span>
            <span
              className="text-muted-foreground ml-1"
              style={{ fontSize: "0.875rem" }}
            >
              days
            </span>
          </div>
          <div
            className="dark:text-orange-400 text-orange-600"
            style={{ fontSize: "0.75rem" }}
          >
            Keep it up! 🔥
          </div>
        </div>
      </div>
    </div>
  );
}
