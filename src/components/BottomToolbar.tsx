import { Sparkles, Mic, ArrowUp } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";

interface BottomToolbarProps {
  onContinueStory: (text: string) => void;
  isGenerating: boolean;
}

export function BottomToolbar({
  onContinueStory,
  isGenerating,
}: BottomToolbarProps) {
  const [inputText, setInputText] = useState("");
  const maxChars = 1000;

  const handleSubmit = () => {
    if (inputText.trim() && !isGenerating) {
      onContinueStory(inputText);
      setInputText("");
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-border/30 glass backdrop-blur-xl">
      <div className="px-6 py-4">
        <div className="relative glass-card rounded-2xl p-4">
          <Textarea
            value={inputText}
            onChange={(e) => {
              if (e.target.value.length <= maxChars) {
                setInputText(e.target.value);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Continue weaving your story... Let your imagination flow freely."
            className="min-h-[100px] resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 pr-20"
            disabled={isGenerating}
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              lineHeight: "1.8",
            }}
          />
          <div
            className="absolute bottom-4 right-4 text-muted-foreground/50"
            style={{ fontSize: "0.75rem" }}
          >
            {inputText.length}/{maxChars}
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="dark:text-purple-400 text-purple-600 dark:hover:text-purple-300 hover:text-purple-700 hover:bg-purple-500/10 gap-2 rounded-full"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">
                Get AI suggestions
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground dark:hover:bg-white/5 hover:bg-black/5 gap-2 rounded-full"
            >
              <Mic className="w-4 h-4" />
              <span className="hidden sm:inline">
                Voice input
              </span>
            </Button>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!inputText.trim() || isGenerating}
            className="gradient-purple hover:opacity-90 transition-opacity gap-2 px-6 rounded-full shadow-lg shadow-purple-500/30"
            style={{ fontSize: "0.875rem" }}
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                Continue Story
                <ArrowUp className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}