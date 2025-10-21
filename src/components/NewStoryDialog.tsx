import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Sparkles } from "lucide-react";

interface NewStoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateStory: (title: string, initialText: string) => void;
}

export function NewStoryDialog({
  open,
  onOpenChange,
  onCreateStory,
}: NewStoryDialogProps) {
  const [title, setTitle] = useState("");
  const [initialText, setInitialText] = useState("");

  const handleCreate = () => {
    if (title.trim()) {
      onCreateStory(title, initialText);
      setTitle("");
      setInitialText("");
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreate();
    }
  };

  const handleTextareaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleCreate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass backdrop-blur-xl sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Create New Story
          </DialogTitle>
          <DialogDescription>
            Give your story a title and optionally start with an opening line.
            Press Enter to create!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="story-title">Story Title</Label>
            <Input
              id="story-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              placeholder="e.g., The Enchanted Library"
              className="glass-card"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="initial-text">Opening Lines (Optional)</Label>
            <Textarea
              id="initial-text"
              value={initialText}
              onChange={(e) => setInitialText(e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              placeholder="Start your story here... or leave blank to begin with AI collaboration."
              className="glass-card min-h-[120px] resize-none"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                lineHeight: "1.8",
              }}
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!title.trim()}
              className="gradient-purple hover:opacity-90 transition-opacity gap-2 rounded-full shadow-lg shadow-purple-500/30"
            >
              <Sparkles className="w-4 h-4" />
              Create Story
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
