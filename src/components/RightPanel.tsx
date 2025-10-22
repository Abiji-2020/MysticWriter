import { useState } from "react";
import { Users, BarChart3 } from "lucide-react";
import { CharacterAvatarsPanel } from "./CharacterAvatarsPanel";
import { WritingAnalytics } from "./WritingAnalytics";

interface Character {
  id: string;
  storyId: string;
  name: string;
  description: string;
  role: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface RightPanelProps {
  characters: Character[];
  onGenerateAvatar: (name: string, description: string) => Promise<string>;
  onDeleteCharacter: (characterId: string) => Promise<void>;
  onGenerateRandomCharacter: () => Promise<{
    name: string;
    description: string;
  }>;
  isGenerating: boolean;
  totalWords: number;
  wordsToday: number;
  activeCharacters: number;
  contributionPercentage: number;
  streakDays: number;
  hasStorySelected: boolean;
}

export function RightPanel({
  characters,
  onGenerateAvatar,
  onDeleteCharacter,
  onGenerateRandomCharacter,
  isGenerating,
  totalWords,
  wordsToday,
  activeCharacters,
  contributionPercentage,
  streakDays,
  hasStorySelected,
}: RightPanelProps) {
  const [activeView, setActiveView] = useState<"analytics" | "characters">(
    "characters",
  );

  return (
    <div className="w-full xl:w-80 h-full border-l border-border/30 glass backdrop-blur-xl flex flex-col">
      {/* Toggle Header */}
      <div className="p-3 border-b border-border/30">
        <div className="glass-card rounded-full p-1 flex items-center gap-1">
          <button
            onClick={() => setActiveView("analytics")}
            className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-3 rounded-full transition-all ${
              activeView === "analytics"
                ? "gradient-purple text-white shadow-lg shadow-purple-500/30"
                : "text-muted-foreground hover:text-foreground"
            }`}
            style={{ fontSize: "0.75rem" }}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Analytics</span>
          </button>
          <button
            onClick={() => setActiveView("characters")}
            className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-3 rounded-full transition-all ${
              activeView === "characters"
                ? "gradient-purple text-white shadow-lg shadow-purple-500/30"
                : "text-muted-foreground hover:text-foreground"
            }`}
            style={{ fontSize: "0.75rem" }}
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Characters</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeView === "analytics" ? (
          <WritingAnalytics
            totalWords={totalWords}
            wordsToday={wordsToday}
            activeCharacters={activeCharacters}
            contributionPercentage={contributionPercentage}
            streakDays={streakDays}
          />
        ) : (
          <CharacterAvatarsPanel
            characters={characters}
            onGenerateAvatar={onGenerateAvatar}
            onDeleteCharacter={onDeleteCharacter}
            onGenerateRandomCharacter={onGenerateRandomCharacter}
            isGenerating={isGenerating}
            hasStorySelected={hasStorySelected}
          />
        )}
      </div>
    </div>
  );
}
