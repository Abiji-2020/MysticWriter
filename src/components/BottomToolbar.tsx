import { Sparkles, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState, useEffect, useRef } from "react";

interface BottomToolbarProps {
  onContinueStory: (text: string) => void;
  isGenerating: boolean;
}

export function BottomToolbar({
  onContinueStory,
  isGenerating,
}: BottomToolbarProps) {
  const [inputText, setInputText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxChars = 1000;

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputText]);

  const handleSubmit = () => {
    if (inputText.trim() && !isGenerating) {
      onContinueStory(inputText);
      setInputText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-border/30 glass backdrop-blur-xl">
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="glass-card rounded-2xl p-3 sm:p-4">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => {
                  if (e.target.value.length <= maxChars) {
                    setInputText(e.target.value);
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="Continue weaving your story..."
                className="resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[40px] max-h-[200px] overflow-y-auto custom-scrollbar pr-16"
                disabled={isGenerating}
                rows={1}
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  lineHeight: "1.6",
                }}
              />
              <div
                className="absolute bottom-2 right-2 text-muted-foreground/50 pointer-events-none"
                style={{ fontSize: "0.7rem" }}
              >
                {inputText.length}/{maxChars}
              </div>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!inputText.trim() || isGenerating}
              size="icon"
              className="gradient-purple hover:opacity-90 transition-opacity h-11 w-11 sm:h-12 sm:w-12 rounded-full shadow-lg shadow-purple-500/30 flex-shrink-0"
            >
              {isGenerating ? (
                <Sparkles className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
        <p
          className="hidden sm:block text-muted-foreground mt-2 ml-1"
          style={{ fontSize: "0.75rem" }}
        >
          Press{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
            ⌘
          </kbd>{" "}
          +{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
            Enter
          </kbd>{" "}
          to send
        </p>
      </div>
    </div>
  );
}
