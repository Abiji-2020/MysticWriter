import { useState } from "react";
import { Sparkles, MoreVertical, Shuffle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Character {
  id: string;
  name: string;
  description: string;
  role: string;
  avatar?: string;
  status: "active" | "mentioned" | "inactive";
  statusLabel: string;
}

interface CharacterAvatarsPanelProps {
  characters: Character[];
  onGenerateAvatar: (name: string, description: string) => Promise<string>;
  isGenerating: boolean;
  hasStorySelected?: boolean;
}

export function CharacterAvatarsPanel({
  characters,
  onGenerateAvatar,
  isGenerating,
  hasStorySelected = true,
}: CharacterAvatarsPanelProps) {
  const [characterName, setCharacterName] = useState("");
  const [description, setDescription] = useState("");

  const handleGenerate = async () => {
    if (!description.trim()) return;
    await onGenerateAvatar(characterName, description);
    setCharacterName("");
    setDescription("");
  };

  const handleRandom = () => {
    const randomNames = [
      "Elara Moonwhisper",
      "Marcus the Librarian",
      "Zephyr Stormcaller",
      "Luna Shadowdancer",
      "Orion Brightforge",
    ];
    const randomDescriptions = [
      "A mysterious figure cloaked in shadows, with piercing silver eyes",
      "An elderly wizard with a long white beard and twinkling eyes",
      "A young warrior with battle scars and determination in their gaze",
      "An ethereal being with flowing robes and an otherworldly presence",
    ];

    setCharacterName(
      randomNames[Math.floor(Math.random() * randomNames.length)],
    );
    setDescription(
      randomDescriptions[Math.floor(Math.random() * randomDescriptions.length)],
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500";
      case "mentioned":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "mentioned":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
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
                      <div className="relative">
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
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-sidebar ${getStatusColor(
                            character.status,
                          )} shadow-lg`}
                          style={{
                            boxShadow: `0 0 10px ${
                              character.status === "active"
                                ? "rgba(16, 185, 129, 0.5)"
                                : character.status === "mentioned"
                                  ? "rgba(249, 115, 22, 0.5)"
                                  : "rgba(107, 114, 128, 0.5)"
                            }`,
                          }}
                        />
                      </div>
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
                            className="h-6 w-6 -mt-1 -mr-1 rounded-full"
                          >
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`${getStatusBadgeStyle(character.status)}`}
                          style={{ fontSize: "0.625rem" }}
                        >
                          {character.statusLabel}
                        </Badge>
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
                  className="dark:text-purple-400 text-purple-600 dark:hover:text-purple-300 hover:text-purple-700 h-auto py-1 px-2 rounded-full"
                  style={{ fontSize: "0.75rem" }}
                >
                  <Shuffle className="w-3 h-3 mr-1" />
                  Random
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
