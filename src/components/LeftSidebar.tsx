import { Plus, FileText, Clock, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface Story {
  id: string;
  title: string;
  wordCount: number;
  lastModified: string;
}

interface LeftSidebarProps {
  stories: Story[];
  selectedStoryId: string | null;
  onStorySelect: (storyId: string) => void;
  onNewStory: () => void;
  onDeleteStory: (storyId: string) => void;
}

export function LeftSidebar({
  stories,
  selectedStoryId,
  onStorySelect,
  onNewStory,
  onDeleteStory,
}: LeftSidebarProps) {
  return (
    <div className="w-full lg:w-72 h-full border-r border-border/30 glass backdrop-blur-xl flex flex-col">
      {/* New Story Button */}
      <div className="p-4 border-b border-border/30">
        <Button
          onClick={onNewStory}
          className="w-full gradient-purple hover:opacity-90 transition-opacity gap-2 rounded-full shadow-lg shadow-purple-500/30"
        >
          <Plus className="w-4 h-4" />
          New Story
        </Button>
      </div>

      {/* Stories List */}
      <ScrollArea className="flex-1 custom-scrollbar">
        <div className="p-3 space-y-2">
          {stories.length === 0 ? (
            <div className="text-center py-8 px-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <p
                className="text-muted-foreground"
                style={{ fontSize: "0.875rem" }}
              >
                No stories yet. Create your first story to begin!
              </p>
            </div>
          ) : (
            stories.map((story) => (
              <div
                key={story.id}
                className={`group relative rounded-xl transition-all ${
                  selectedStoryId === story.id
                    ? "glass-card border-2 story-selected shadow-xl"
                    : "glass-card hover:bg-card/50 border border-border/30"
                }`}
              >
                <button
                  onClick={() => onStorySelect(story.id)}
                  className="w-full text-left p-3 pr-10"
                >
                  <h3
                    className={`mb-1.5 line-clamp-1 ${
                      selectedStoryId === story.id
                        ? "text-foreground"
                        : "text-foreground"
                    }`}
                    style={{
                      fontSize: "0.9375rem",
                      fontWeight: selectedStoryId === story.id ? "500" : "400",
                    }}
                  >
                    {story.title}
                  </h3>
                  <div
                    className="flex items-center gap-3 text-muted-foreground"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3 h-3" />
                      <span>{story.wordCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      <span>{story.lastModified}</span>
                    </div>
                  </div>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteStory(story.id);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
