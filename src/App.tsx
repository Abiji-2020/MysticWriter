import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { storyService } from "./services/storyService";
import { aiService } from "./services/aiService";
import { characterService } from "./services/characterService";
import { storyHistoryService } from "./services/storyHistoryService";
import { analyticsService } from "./services/analyticsService";
import { Header } from "./components/Header";
import { LeftSidebar } from "./components/LeftSidebar";
import { StoryDisplay } from "./components/StoryDisplay";
import { BottomToolbar } from "./components/BottomToolbar";
import { RightPanel } from "./components/RightPanel";
import { EmptyState } from "./components/EmptyState";
import { NewStoryDialog } from "./components/NewStoryDialog";
import { WritingAnalytics } from "./components/WritingAnalytics";
import { CharacterAvatarsPanel } from "./components/CharacterAvatarsPanel";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { OAuthCallback } from "./pages/auth/OAuthCallback";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./components/ui/sheet";
import { FileText, Users, BarChart3 } from "lucide-react";
import React from "react";
import type {
  Story as ServiceStory,
  StorySegment as ServiceSegment,
} from "./services/storyService";

interface StorySegment {
  id: string;
  text: string;
  author: "user" | "ai";
  timestamp?: string;
}

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

interface Story {
  id: string;
  title: string;
  wordCount: number;
  lastModified: string;
  segments: StorySegment[];
  characters: Character[];
}

// Helper function to convert service Story to UI Story
function mapServiceStoryToUI(serviceStory: ServiceStory): Story {
  return {
    id: serviceStory.id,
    title: serviceStory.title,
    wordCount: serviceStory.wordCount,
    lastModified: new Date(serviceStory.updatedAt).toLocaleDateString(),
    segments: serviceStory.segments.map((seg: ServiceSegment) => ({
      id: seg.id,
      text: seg.text,
      author: seg.author,
      timestamp: new Date(seg.createdAt).toLocaleTimeString(),
    })),
    characters: [],
  };
}

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4" />
          <p className="text-foreground font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Main App Component
function AppContent() {
  const { user } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark" | "system">("dark");
  const [temperature, setTemperature] = useState(0.7);
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAvatarGenerating, setIsAvatarGenerating] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNewStoryDialogOpen, setIsNewStoryDialogOpen] = useState(false);
  const [isLoadingStories, setIsLoadingStories] = useState(false);
  const [mobileView, setMobileView] = useState<
    "stories" | "analytics" | "characters"
  >("stories");
  const [analytics, setAnalytics] = useState({
    totalWords: 0,
    wordsToday: 0,
    activeCharacters: 0,
    streakDays: 0,
  });
  const [error, setError] = useState<string | null>(null);

  // Get current story
  const currentStory = stories.find((s) => s.id === selectedStoryId);

  // Use analytics from state
  const { wordsToday, activeCharacters, streakDays } = analytics;

  // Load stories from database on mount
  useEffect(() => {
    const loadStories = async () => {
      if (!user?.id) return;
      try {
        setIsLoadingStories(true);
        setError(null);
        const userStories = await storyService.getUserStories(user.id);
        const mappedStories = userStories.map(mapServiceStoryToUI);
        setStories(mappedStories);
        if (mappedStories.length > 0 && !selectedStoryId) {
          setSelectedStoryId(mappedStories[0].id);
        }
      } catch (err) {
        console.error("Failed to load stories:", err);
        setError(err instanceof Error ? err.message : "Failed to load stories");
      } finally {
        setIsLoadingStories(false);
      }
    };

    loadStories();
  }, [user?.id, selectedStoryId]);

  // Load story segments and characters when story is selected
  useEffect(() => {
    const loadStoryData = async () => {
      if (!selectedStoryId) return;
      try {
        setError(null);

        // Load full story with segments
        const fullStory = await storyService.getStory(selectedStoryId);
        const mappedStory = mapServiceStoryToUI(fullStory);

        // Load characters
        const characters =
          await characterService.getStoryCharacters(selectedStoryId);

        // Update story with segments and characters using functional update
        setStories((prevStories) =>
          prevStories.map((story) =>
            story.id === selectedStoryId
              ? { ...mappedStory, characters }
              : story,
          ),
        );
      } catch (err) {
        console.error("Failed to load story data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load story data",
        );
      }
    };

    loadStoryData();
  }, [selectedStoryId]);

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

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    // Apply theme to document immediately
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleTemperatureChange = (temp: number) => {
    setTemperature(temp);
  };

  // Load analytics from database
  useEffect(() => {
    const loadAnalytics = async () => {
      if (!user?.id) return;
      try {
        const summary = await analyticsService.getAnalyticsSummary(user.id);
        setAnalytics(summary);
      } catch (err) {
        console.error("Failed to load analytics:", err);
      }
    };

    loadAnalytics();
  }, [user?.id, stories]); // Reload when stories change

  // Calculate contribution percentage for current story
  const totalWords = currentStory
    ? currentStory.segments.reduce((acc, segment) => {
        return (
          acc + segment.text.split(/\s+/).filter((w) => w.length > 0).length
        );
      }, 0)
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

  // Format timestamp
  const getTimestamp = () => {
    const timeAgo = Math.floor(Math.random() * 5) + 1;
    return `${timeAgo} ${timeAgo === 1 ? "minute" : "minutes"} ago`;
  };

  // Create new story
  const handleCreateStory = async (title: string, initialText: string) => {
    if (!user?.id) {
      setError("User not authenticated");
      return;
    }

    try {
      setError(null);
      const newStory = await storyService.createStory({
        title,
        userId: user.id,
        initialText: initialText.trim() || undefined,
      });

      // Log story creation to history
      await storyHistoryService.logAction(
        newStory.id,
        user.id,
        "created",
        `Story created: ${title}`,
      );

      // Track story creation in analytics
      await analyticsService.trackStoryCreated(user.id);

      const mappedStory = mapServiceStoryToUI(newStory);
      setStories([mappedStory, ...stories]);
      setSelectedStoryId(mappedStory.id);
      setIsNewStoryDialogOpen(false);
    } catch (err) {
      console.error("Failed to create story:", err);
      setError(err instanceof Error ? err.message : "Failed to create story");
    }
  };

  // Delete story
  const handleDeleteStory = async (storyId: string) => {
    try {
      setError(null);
      await storyService.deleteStory(storyId);
      setStories(stories.filter((s) => s.id !== storyId));
      if (selectedStoryId === storyId) {
        setSelectedStoryId(
          stories.length > 1
            ? stories.find((s) => s.id !== storyId)?.id || null
            : null,
        );
      }
    } catch (err) {
      console.error("Failed to delete story:", err);
      setError(err instanceof Error ? err.message : "Failed to delete story");
    }
  };

  // Generate AI story response using InsForge AI
  const generateAIResponse = async (userText: string): Promise<string> => {
    try {
      // Build full conversation history for context
      const conversationHistory = currentStory?.segments
        .map((seg) => `${seg.author === "user" ? "User" : "AI"}: ${seg.text}`)
        .join("\n\n");

      // Build characters context
      const charactersContext =
        currentStory?.characters && currentStory.characters.length > 0
          ? `\n\nCharacters in this story:\n${currentStory.characters
              .map(
                (char) => `- ${char.name} (${char.role}): ${char.description}`,
              )
              .join("\n")}`
          : "";

      // Include story title, characters, and full history as context
      const storyContext = `Story: "${currentStory?.title || "Untitled"}"${charactersContext}\n\nPrevious conversation:\n${conversationHistory || "This is the beginning of the story."}`;

      const response = await aiService.generateStoryResponse(
        userText,
        storyContext,
        {
          model: "gpt-4o",
          temperature,
          maxTokens: 300,
        },
      );
      return response;
    } catch (err) {
      console.error("AI generation failed:", err);
      // Fallback response
      return "The story continues... Tell me more about what happens next.";
    }
  };

  const handleContinueStory = async (text: string) => {
    if (!currentStory || !selectedStoryId) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Save user segment to database
      const userSegment = await storyService.addSegment(
        selectedStoryId,
        text,
        "user",
      );

      // Track words written in analytics
      if (user?.id) {
        const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;
        await analyticsService.trackWordsWritten(user.id, wordCount);
      }

      // Update UI with user segment
      setStories(
        stories.map((story) =>
          story.id === selectedStoryId
            ? {
                ...story,
                segments: [
                  ...story.segments,
                  { ...userSegment, timestamp: getTimestamp() },
                ],
                wordCount:
                  story.wordCount +
                  text.split(/\s+/).filter((w) => w.length > 0).length,
                lastModified: "Just now",
              }
            : story,
        ),
      );

      // Generate AI response
      const aiText = await generateAIResponse(text);

      // Save AI segment to database
      const aiSegment = await storyService.addSegment(
        selectedStoryId,
        aiText,
        "ai",
      );

      // Update UI with AI segment
      setStories((prevStories) =>
        prevStories.map((story) =>
          story.id === selectedStoryId
            ? {
                ...story,
                segments: [
                  ...story.segments,
                  { ...aiSegment, timestamp: getTimestamp() },
                ],
                wordCount:
                  story.wordCount +
                  aiText.split(/\s+/).filter((w) => w.length > 0).length,
                lastModified: "Just now",
              }
            : story,
        ),
      );
    } catch (err) {
      console.error("Failed to continue story:", err);
      setError(err instanceof Error ? err.message : "Failed to continue story");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAvatar = async (
    characterName: string,
    description: string,
  ): Promise<string> => {
    if (!currentStory || !selectedStoryId) return "";

    setIsAvatarGenerating(true);
    setError(null);

    try {
      // Create character with AI-generated avatar
      const newCharacter = await characterService.createCharacter({
        storyId: selectedStoryId,
        name: characterName,
        role: "Character",
        generateAvatar: true,
      });

      // Track character creation in analytics
      if (user?.id) {
        await analyticsService.trackCharacterCreated(user.id);
      }

      // Update UI with new character
      setStories(
        stories.map((story) =>
          story.id === selectedStoryId
            ? { ...story, characters: [...story.characters, newCharacter] }
            : story,
        ),
      );

      return newCharacter.avatar || "";
    } catch (err) {
      console.error("Failed to generate avatar:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate avatar",
      );
      return "";
    } finally {
      setIsAvatarGenerating(false);
    }
  };

  const handleDeleteCharacter = async (characterId: string): Promise<void> => {
    if (!currentStory || !selectedStoryId) return;

    setError(null);

    try {
      // Delete character from database
      await characterService.deleteCharacter(characterId);

      // Update UI by removing the character
      setStories(
        stories.map((story) =>
          story.id === selectedStoryId
            ? {
                ...story,
                characters: story.characters.filter(
                  (c) => c.id !== characterId,
                ),
              }
            : story,
        ),
      );
    } catch (err) {
      console.error("Failed to delete character:", err);
      setError(
        err instanceof Error ? err.message : "Failed to delete character",
      );
      throw err; // Re-throw so the component can handle it
    }
  };

  const handleGenerateRandomCharacter = async (): Promise<{
    name: string;
    description: string;
  }> => {
    if (!currentStory) {
      return {
        name: "Wandering Traveler",
        description: "A mysterious figure with an unknown past.",
      };
    }

    try {
      // Build story context from segments
      const storyContext = currentStory.segments
        .slice(-3) // Last 3 segments for context
        .map((seg) => seg.text)
        .join(" ");

      const randomCharacter = await aiService.generateRandomCharacter(
        currentStory.title,
        storyContext,
      );

      return randomCharacter;
    } catch (err) {
      console.error("Failed to generate random character:", err);
      return {
        name: "Wandering Traveler",
        description: "A mysterious figure with an unknown past.",
      };
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
        temperature={temperature}
        onTemperatureChange={handleTemperatureChange}
        onThemeChange={handleThemeChange}
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
          {error && (
            <div className="p-4 bg-red-500/10 border-b border-red-500/30">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          {isLoadingStories ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4" />
                <p className="text-foreground font-medium">
                  Loading stories...
                </p>
              </div>
            </div>
          ) : currentStory ? (
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
            onDeleteCharacter={handleDeleteCharacter}
            onGenerateRandomCharacter={handleGenerateRandomCharacter}
            isGenerating={isAvatarGenerating}
            totalWords={analytics.totalWords}
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
                    totalWords={analytics.totalWords}
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
                  onDeleteCharacter={handleDeleteCharacter}
                  onGenerateRandomCharacter={handleGenerateRandomCharacter}
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

// App Wrapper with Routing
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppContent />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
