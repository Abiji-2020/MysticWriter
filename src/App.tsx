import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { LeftSidebar } from "./components/LeftSidebar";
import { StoryDisplay } from "./components/StoryDisplay";
import { BottomToolbar } from "./components/BottomToolbar";
import { RightPanel } from "./components/RightPanel";
import { EmptyState } from "./components/EmptyState";
import { NewStoryDialog } from "./components/NewStoryDialog";
import { WritingAnalytics } from "./components/WritingAnalytics";
import { CharacterAvatarsPanel } from "./components/CharacterAvatarsPanel";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./components/ui/sheet";
import { FileText, Users, BarChart3 } from "lucide-react";

interface StorySegment {
  id: string;
  text: string;
  author: "user" | "ai";
  timestamp?: string;
}

interface Character {
  id: string;
  name: string;
  description: string;
  role: string;
  avatar?: string;
  status: "active" | "mentioned" | "inactive";
  statusLabel: string;
}

interface Story {
  id: string;
  title: string;
  wordCount: number;
  lastModified: string;
  segments: StorySegment[];
  characters: Character[];
}

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAvatarGenerating, setIsAvatarGenerating] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNewStoryDialogOpen, setIsNewStoryDialogOpen] = useState(false);
  const [mobileView, setMobileView] = useState<
    "stories" | "analytics" | "characters"
  >("stories");

  // Get current story
  const currentStory = stories.find((s) => s.id === selectedStoryId);

  // Apply theme to document
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Calculate story metrics for current story
  const totalWords = currentStory
    ? currentStory.segments.reduce((acc, segment) => {
        return (
          acc + segment.text.split(/\s+/).filter((w) => w.length > 0).length
        );
      }, 0)
    : 0;

  const wordsToday = currentStory
    ? currentStory.segments
        .filter((segment) => segment.author === "user")
        .reduce((acc, segment) => {
          return (
            acc + segment.text.split(/\s+/).filter((w) => w.length > 0).length
          );
        }, 0)
    : 0;

  const activeCharacters = currentStory
    ? currentStory.characters.filter((c) => c.status === "active").length
    : 0;

  const userWords = currentStory
    ? currentStory.segments
        .filter((s) => s.author === "user")
        .reduce(
          (acc, s) =>
            acc + s.text.split(/\s+/).filter((w) => w.length > 0).length,
          0,
        )
    : 0;

  const contributionPercentage =
    totalWords > 0 ? Math.round((userWords / totalWords) * 100) : 0;

  const streakDays = 7; // Mock data

  // Format timestamp
  const getTimestamp = () => {
    const timeAgo = Math.floor(Math.random() * 5) + 1;
    return `${timeAgo} ${timeAgo === 1 ? "minute" : "minutes"} ago`;
  };

  // Create new story
  const handleCreateStory = (title: string, initialText: string) => {
    const newStory: Story = {
      id: Date.now().toString(),
      title,
      wordCount: initialText.split(/\s+/).filter((w) => w.length > 0).length,
      lastModified: "Just now",
      segments: initialText.trim()
        ? [
            {
              id: Date.now().toString(),
              text: initialText,
              author: "user",
              timestamp: getTimestamp(),
            },
          ]
        : [],
      characters: [],
    };

    setStories([newStory, ...stories]);
    setSelectedStoryId(newStory.id);
    setIsNewStoryDialogOpen(false);
  };

  // Delete story
  const handleDeleteStory = (storyId: string) => {
    setStories(stories.filter((s) => s.id !== storyId));
    if (selectedStoryId === storyId) {
      setSelectedStoryId(
        stories.length > 1
          ? stories.find((s) => s.id !== storyId)?.id || null
          : null,
      );
    }
  };

  // Simulate AI story generation
  const generateAIResponse = async (userText: string): Promise<string> => {
    const aiResponses = [
      "As her eyes adjusted to the darkness, Sarah noticed something extraordinary. The books on the shelves seemed to shimmer with an otherworldly luminescence, their spines pulsing gently like sleeping heartbeats. She approached the nearest shelf cautiously, her fingertips grazing the ancient leather binding of a particularly ornate volume. The moment she touched it, whispers began to emanate from its pages—voices of characters long forgotten, pleading to have their stories told once more.",

      "The Keeper emerged from the shadows, moving with an unsettling grace that defied the natural laws of physics. His form seemed to flicker between solid and translucent, as if he existed in multiple dimensions simultaneously. 'You should not have come here,' he spoke, his voice echoing from everywhere and nowhere at once. 'The library chooses its visitors carefully, and those it selects rarely leave unchanged.'",

      "Sarah's hand trembled as she pulled the ornate volume from the shelf. The book fell open of its own accord, revealing pages filled with shimmering text that seemed to rearrange itself as she watched. Words lifted off the parchment, swirling in the air like golden fireflies before coalescing into images—scenes from a story that felt both familiar and impossibly ancient. She saw herself reflected in those floating visions, but not as she was now. Instead, she witnessed versions of herself from countless parallel lives, each one making different choices, walking different paths.",

      "The ground beneath her feet began to shift and ripple like water. Sarah gasped as the library's marble floor transformed into a map of constellations, each star representing a different story, a different world waiting to be explored. The Keeper's eyes gleamed with an emotion that might have been sympathy or perhaps anticipation. 'Every person who enters this library becomes part of its collection,' he explained. 'But you, Sarah, you have the potential to become more than just another tale on our shelves. You could become a storyteller yourself, one who shapes reality with words.'",

      "A sound like distant thunder rolled through the library, causing the shelves to tremble and ancient dust to cascade from the ceiling like snow. Sarah turned to see a massive door materializing where none had existed before—a portal carved from pure obsidian, covered in symbols that hurt to look at directly. The Keeper's expression shifted to one of genuine alarm. 'No,' he whispered. 'The Archive of Unfinished Stories... it shouldn't be opening. Not yet. Not for you.' But the door was already swinging wide, revealing a darkness so complete it seemed to devour the light around it.",
    ];

    const randomResponse =
      aiResponses[Math.floor(Math.random() * aiResponses.length)];
    return randomResponse;
  };

  const handleContinueStory = async (text: string) => {
    if (!currentStory) return;

    const userSegment: StorySegment = {
      id: Date.now().toString(),
      text,
      author: "user",
      timestamp: getTimestamp(),
    };

    // Update current story with user segment
    setStories(
      stories.map((story) =>
        story.id === selectedStoryId
          ? {
              ...story,
              segments: [...story.segments, userSegment],
              wordCount:
                story.wordCount +
                text.split(/\s+/).filter((w) => w.length > 0).length,
              lastModified: "Just now",
            }
          : story,
      ),
    );

    setIsGenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      const aiText = await generateAIResponse(text);

      const aiSegment: StorySegment = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        author: "ai",
        timestamp: getTimestamp(),
      };

      // Update current story with AI segment
      setStories((prevStories) =>
        prevStories.map((story) =>
          story.id === selectedStoryId
            ? {
                ...story,
                segments: [...story.segments, aiSegment],
                wordCount:
                  story.wordCount +
                  aiText.split(/\s+/).filter((w) => w.length > 0).length,
                lastModified: "Just now",
              }
            : story,
        ),
      );
    } catch (error) {
      console.error("Failed to generate AI response:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAvatar = async (
    characterName: string,
    description: string,
  ): Promise<string> => {
    if (!currentStory) return "";

    setIsAvatarGenerating(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockImages = [
        "https://images.unsplash.com/photo-1758850253805-8572b62e376d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwY2hhcmFjdGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYwOTQ2MzgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1615672968364-d59e8d4be430?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpZXZhbCUyMHdhcnJpb3IlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjEwMjI0OTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1579572331145-5e53b299c64e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteXN0ZXJpb3VzJTIwcGVyc29uJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxMDIyNTAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      ];

      const imageUrl =
        mockImages[Math.floor(Math.random() * mockImages.length)];

      // If character name is provided, add to current story's characters
      if (characterName.trim()) {
        const newCharacter: Character = {
          id: Date.now().toString(),
          name: characterName,
          description,
          role: "Custom Character",
          avatar: imageUrl,
          status: "inactive",
          statusLabel: "Created",
        };

        setStories(
          stories.map((story) =>
            story.id === selectedStoryId
              ? { ...story, characters: [...story.characters, newCharacter] }
              : story,
          ),
        );
      }

      return imageUrl;
    } finally {
      setIsAvatarGenerating(false);
    }
  };

  const handleNewStory = () => {
    setIsNewStoryDialogOpen(true);
  };

  const handleStorySelect = (storyId: string) => {
    setSelectedStoryId(storyId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen md:h-screen flex flex-col bg-background">
      <Header
        theme={theme}
        onThemeToggle={toggleTheme}
        onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
        currentStoryTitle={currentStory?.title}
      />

      <div className="flex-1 flex md:overflow-hidden">
        {/* Left Sidebar - Desktop only (hidden on mobile/tablet) */}
        <div className="hidden lg:block">
          <LeftSidebar
            stories={stories}
            selectedStoryId={selectedStoryId}
            onStorySelect={handleStorySelect}
            onNewStory={handleNewStory}
            onDeleteStory={handleDeleteStory}
          />
        </div>

        {/* Main Story Area - Full width on mobile */}
        <div className="flex-1 flex flex-col md:overflow-hidden min-w-0">
          {currentStory ? (
            <>
              <div className="flex-1 md:overflow-hidden">
                <StoryDisplay
                  segments={currentStory.segments}
                  isGenerating={isGenerating}
                />
              </div>
              <BottomToolbar
                onContinueStory={handleContinueStory}
                isGenerating={isGenerating}
              />
            </>
          ) : (
            <EmptyState onNewStory={handleNewStory} />
          )}
        </div>

        {/* Right Panel - Desktop only (hidden on mobile/tablet) */}
        <div className="hidden xl:block">
          <RightPanel
            characters={currentStory?.characters || []}
            onGenerateAvatar={handleGenerateAvatar}
            isGenerating={isAvatarGenerating}
            totalWords={totalWords}
            wordsToday={wordsToday}
            activeCharacters={activeCharacters}
            contributionPercentage={contributionPercentage}
            streakDays={streakDays}
            hasStorySelected={!!currentStory}
          />
        </div>
      </div>

      {/* New Story Dialog */}
      <NewStoryDialog
        open={isNewStoryDialogOpen}
        onOpenChange={setIsNewStoryDialogOpen}
        onCreateStory={handleCreateStory}
      />

      {/* Mobile/Tablet Sheet - Accessible on lg and smaller screens */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent
          side="left"
          className="w-full sm:w-[400px] p-0 glass backdrop-blur-xl"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>
              Access stories, analytics, and character management
            </SheetDescription>
          </SheetHeader>
          <div className="h-full flex flex-col">
            {/* Mobile Navigation */}
            <div className="p-4 border-b border-border/30">
              <div className="glass-card rounded-full p-1 flex items-center gap-1">
                <button
                  onClick={() => setMobileView("stories")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-full transition-all ${
                    mobileView === "stories"
                      ? "gradient-purple text-white shadow-lg shadow-purple-500/30"
                      : "text-muted-foreground"
                  }`}
                  style={{ fontSize: "0.8125rem" }}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Stories</span>
                </button>
                <button
                  onClick={() => setMobileView("analytics")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-full transition-all ${
                    mobileView === "analytics"
                      ? "gradient-purple text-white shadow-lg shadow-purple-500/30"
                      : "text-muted-foreground"
                  }`}
                  style={{ fontSize: "0.8125rem" }}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Analytics</span>
                </button>
                <button
                  onClick={() => setMobileView("characters")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-full transition-all ${
                    mobileView === "characters"
                      ? "gradient-purple text-white shadow-lg shadow-purple-500/30"
                      : "text-muted-foreground"
                  }`}
                  style={{ fontSize: "0.8125rem" }}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Characters</span>
                </button>
              </div>
            </div>

            {/* Mobile Content */}
            <div className="flex-1 overflow-hidden">
              {mobileView === "stories" && (
                <LeftSidebar
                  stories={stories}
                  selectedStoryId={selectedStoryId}
                  onStorySelect={handleStorySelect}
                  onNewStory={handleNewStory}
                  onDeleteStory={handleDeleteStory}
                />
              )}
              {mobileView === "analytics" && (
                <div className="h-full overflow-y-auto custom-scrollbar">
                  <WritingAnalytics
                    totalWords={totalWords}
                    wordsToday={wordsToday}
                    activeCharacters={activeCharacters}
                    contributionPercentage={contributionPercentage}
                    streakDays={streakDays}
                  />
                </div>
              )}
              {mobileView === "characters" && (
                <CharacterAvatarsPanel
                  characters={currentStory?.characters || []}
                  onGenerateAvatar={handleGenerateAvatar}
                  isGenerating={isAvatarGenerating}
                  hasStorySelected={!!currentStory}
                />
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
