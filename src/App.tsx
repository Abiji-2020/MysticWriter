import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { StoryHeader } from "./components/StoryHeader";
import { StoryDisplay } from "./components/StoryDisplay";
import { BottomToolbar } from "./components/BottomToolbar";
import { CharacterAvatarsPanel } from "./components/CharacterAvatarPanel";
import { WritingAnalytics } from "./components/WritingAnalytics";
import { Sheet, SheetContent, SheetHeader } from "./components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { ScrollArea } from "./components/ui/scroll-area";

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

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [segments, setSegments] = useState<StorySegment[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAvatarGenerating, setIsAvatarGenerating] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([
    {
      id: "1",
      name: "Sarah",
      description: "A curious urban explorer",
      role: "Protagonist • Library Explorer",
      status: "active",
      statusLabel: "Active",
    },
    {
      id: "2",
      name: "The Keeper",
      description: "A mysterious library guardian",
      role: "Supporting • Library Guardian",
      status: "mentioned",
      statusLabel: "Mentioned",
    },
  ]);

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

  // Calculate story metrics
  const totalWords = segments.reduce((acc, segment) => {
    return acc + segment.text.split(/\s+/).filter((w) => w.length > 0).length;
  }, 0);

  const wordsToday = segments
    .filter((segment) => segment.author === "user")
    .reduce((acc, segment) => {
      return acc + segment.text.split(/\s+/).filter((w) => w.length > 0).length;
    }, 0);

  const activeCharacters = characters.filter((c) => c.status === "active").length;

  const userWords = segments
    .filter((s) => s.author === "user")
    .reduce((acc, s) => acc + s.text.split(/\s+/).filter((w) => w.length > 0).length, 0);

  const contributionPercentage = totalWords > 0 ? Math.round((userWords / totalWords) * 100) : 0;

  const streakDays = 7; // Mock data

  // Format timestamp
  const getTimestamp = () => {
    const timeAgo = Math.floor(Math.random() * 5) + 1;
    return `${timeAgo} ${timeAgo === 1 ? "minute" : "minutes"} ago`;
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

    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
    return randomResponse;
  };

  const handleContinueStory = async (text: string) => {
    const userSegment: StorySegment = {
      id: Date.now().toString(),
      text,
      author: "user",
      timestamp: getTimestamp(),
    };
    setSegments([...segments, userSegment]);

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
      setSegments((prev) => [...prev, aiSegment]);
    } catch (error) {
      console.error("Failed to generate AI response:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAvatar = async (
    characterName: string,
    description: string
  ): Promise<string> => {
    setIsAvatarGenerating(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockImages = [
        "https://images.unsplash.com/photo-1758850253805-8572b62e376d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwY2hhcmFjdGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYwOTQ2MzgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1615672968364-d59e8d4be430?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpZXZhbCUyMHdhcnJpb3IlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjEwMjI0OTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1579572331145-5e53b299c64e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteXN0ZXJpb3VzJTIwcGVyc29uJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxMDIyNTAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      ];

      const imageUrl = mockImages[Math.floor(Math.random() * mockImages.length)];

      // If character name is provided, add to characters list
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
        setCharacters([...characters, newCharacter]);
      }

      return imageUrl;
    } finally {
      setIsAvatarGenerating(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header
        theme={theme}
        onThemeToggle={toggleTheme}
        onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Story Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <StoryHeader
            title="The Enchanted Library"
            isActive={true}
            timestamp="2 hours ago"
            wordCount={totalWords}
            characterCount={characters.length}
          />
          <div className="flex-1 overflow-hidden">
            <StoryDisplay segments={segments} isGenerating={isGenerating} />
          </div>
          <BottomToolbar onContinueStory={handleContinueStory} isGenerating={isGenerating} />
        </div>

        {/* Right Sidebar - Desktop */}
        <div className="hidden lg:flex flex-col w-96 border-l border-border/30">
          {/* Writing Analytics */}
          <div className="border-b border-border/30">
            <WritingAnalytics
              totalWords={totalWords}
              wordsToday={wordsToday}
              activeCharacters={activeCharacters}
              contributionPercentage={contributionPercentage}
              streakDays={streakDays}
            />
          </div>

          {/* Character Avatars Panel */}
          <div className="flex-1 overflow-hidden">
            <CharacterAvatarsPanel
              characters={characters}
              onGenerateAvatar={handleGenerateAvatar}
              isGenerating={isAvatarGenerating}
            />
          </div>
        </div>
      </div>

      {/* Mobile Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="right" className="w-full sm:w-96 p-0 glass backdrop-blur-xl">
          <Tabs defaultValue="analytics" className="h-full flex flex-col">
            <SheetHeader className="p-4 border-b border-border/30">
              <TabsList className="grid w-full grid-cols-2 glass-card">
                <TabsTrigger value="analytics" className="rounded-xl">Analytics</TabsTrigger>
                <TabsTrigger value="characters" className="rounded-xl">Characters</TabsTrigger>
              </TabsList>
            </SheetHeader>
            <TabsContent value="analytics" className="flex-1 m-0 overflow-hidden">
              <ScrollArea className="h-full">
                <WritingAnalytics
                  totalWords={totalWords}
                  wordsToday={wordsToday}
                  activeCharacters={activeCharacters}
                  contributionPercentage={contributionPercentage}
                  streakDays={streakDays}
                />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="characters" className="flex-1 m-0 overflow-hidden">
              <CharacterAvatarsPanel
                characters={characters}
                onGenerateAvatar={handleGenerateAvatar}
                isGenerating={isAvatarGenerating}
              />
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </div>
  );
}
