import { StorySegment } from "./StorySegment";
import { ScrollArea } from "./ui/scroll-area";

interface StorySegmentData {
  id: string;
  text: string;
  author: "user" | "ai";
  timestamp?: string;
}

interface StoryDisplayProps {
  segments: StorySegmentData[];
  isGenerating: boolean;
}

export function StoryDisplay({ segments, isGenerating }: StoryDisplayProps) {
  return (
    <ScrollArea className="h-full">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {segments.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 dark:from-purple-500/30 dark:to-pink-500/30 flex items-center justify-center border border-purple-500/20 dark:border-purple-500/30 shadow-lg shadow-purple-500/10">
              <svg
                className="w-10 h-10 text-purple-600 dark:text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
            <h3 className="text-foreground mb-3" style={{ fontSize: "1.5rem" }}>
              Begin Your Story
            </h3>
            <p
              className="text-muted-foreground max-w-md mx-auto"
              style={{ fontSize: "1.0625rem", lineHeight: "1.7" }}
            >
              Write your opening lines below and watch as the AI weaves the next
              chapter of your tale with creative magic.
            </p>
          </div>
        ) : (
          segments.map((segment) => (
            <StorySegment
              key={segment.id}
              text={segment.text}
              author={segment.author}
              timestamp={segment.timestamp}
            />
          ))
        )}
        {isGenerating && (
          <StorySegment
            text="Weaving the next chapter of your story with creative magic..."
            author="ai"
            isGenerating={true}
          />
        )}
      </div>
    </ScrollArea>
  );
}
