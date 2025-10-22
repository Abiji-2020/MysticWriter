import { useState } from "react";
import { Sparkles, Shuffle, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ImageWithFallback } from "./figma/ImageWithFallback";

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

interface CharacterAvatarsPanelProps {
  characters: Character[];
  onGenerateAvatar: (name: string, description: string) => Promise<string>;
  onDeleteCharacter: (characterId: string) => Promise<void>;
  onGenerateRandomCharacter: () => Promise<{
    name: string;
    description: string;
  }>;
  isGenerating: boolean;
  hasStorySelected?: boolean;
}

export function CharacterAvatarsPanel({
  characters,
  onGenerateAvatar,
  onDeleteCharacter,
  onGenerateRandomCharacter,
  isGenerating,
  hasStorySelected = true,
}: CharacterAvatarsPanelProps) {
  const [characterName, setCharacterName] = useState("");
  const [description, setDescription] = useState("");
  const [deletingCharacterId, setDeletingCharacterId] = useState<string | null>(
    null,
  );
  const [isGeneratingRandom, setIsGeneratingRandom] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    await onGenerateAvatar(characterName, description);
    setCharacterName("");
    setDescription("");
  };

  const handleDelete = async (characterId: string) => {
    setDeletingCharacterId(characterId);
    try {
      await onDeleteCharacter(characterId);
    } catch (error) {
      console.error("Failed to delete character:", error);
    } finally {
      setDeletingCharacterId(null);
    }
  };

  const handleRandom = async () => {
    setIsGeneratingRandom(true);
    try {
      const randomCharacter = await onGenerateRandomCharacter();
      setCharacterName(randomCharacter.name);
      setDescription(randomCharacter.description);
    } catch (error) {
      console.error("Failed to generate random character:", error);
    } finally {
      setIsGeneratingRandom(false);
    }
  };

  return (
    <div className="h-full flex flex-col glass backdrop-blur-xl overflow-hidden">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {!hasStorySelected ? (
          <div className="p-6 flex items-center justify-center h-full">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-foreground mb-2">No Story Selected</h3>
              <p
                className="text-muted-foreground"
                style={{ fontSize: "0.875rem" }}
              >
                Create or select a story to start managing characters and
                bringing them to life with AI-generated avatars.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Story Characters */}
            <div>
              <h4
                className="text-foreground mb-4"
                style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}
              >
                STORY CHARACTERS
              </h4>
              <div className="space-y-3">
                {characters.map((character) => (
                  <div
                    key={character.id}
                    className="glass-card rounded-xl p-3 hover:bg-card/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="w-12 h-12">
                        {character.avatar ? (
                          <ImageWithFallback
                            src={character.avatar}
                            alt={character.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                            {character.name.charAt(0)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h5
                              className="text-foreground"
                              style={{ fontSize: "0.875rem" }}
                            >
                              {character.name}
                            </h5>
                            <p
                              className="text-muted-foreground"
                              style={{ fontSize: "0.75rem" }}
                            >
                              {character.role}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 -mt-1 -mr-1 rounded-full hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            onClick={() => handleDelete(character.id)}
                            disabled={deletingCharacterId === character.id}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Create New Character */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4
                  className="text-foreground"
                  style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}
                >
                  CREATE NEW CHARACTER
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRandom}
                  disabled={isGeneratingRandom || isGenerating}
                  className="dark:text-purple-400 text-purple-600 dark:hover:text-purple-300 hover:text-purple-700 h-auto py-1 px-2 rounded-full"
                  style={{ fontSize: "0.75rem" }}
                >
                  <Shuffle
                    className={`w-3 h-3 mr-1 ${isGeneratingRandom ? "animate-spin" : ""}`}
                  />
                  {isGeneratingRandom ? "Generating..." : "Random"}
                </Button>
              </div>
              <div className="glass-card rounded-xl p-4 space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="charName"
                    className="text-foreground"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Character Name
                  </Label>
                  <Input
                    id="charName"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    placeholder="e.g., Marcus the Librarian"
                    className="bg-background/50 border-border/50 rounded-xl"
                    disabled={isGenerating}
                    style={{ fontSize: "0.875rem" }}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="appearance"
                    className="text-foreground"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Appearance Description
                  </Label>
                  <Textarea
                    id="appearance"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe their looks, age, clothing, magical features..."
                    className="bg-background/50 border-border/50 min-h-[80px] resize-none rounded-xl"
                    disabled={isGenerating}
                    style={{ fontSize: "0.875rem" }}
                  />
                </div>
                <Button
                  onClick={handleGenerate}
                  disabled={!description.trim() || isGenerating}
                  className="w-full gradient-purple hover:opacity-90 transition-opacity gap-2 rounded-full shadow-lg shadow-purple-500/30"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Avatar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
