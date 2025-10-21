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
      <div className="max-w-4xl mx-auto px-6 py-6">
        {segments.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-primary"
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
            <h3 className="text-foreground mb-2">Begin Your Story</h3>
            <p className="text-muted-foreground">
              Write your opening lines below and watch as the AI continues your tale.
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
            text="Weaving the next chapter of your story..."
            author="ai"
            isGenerating={true}
          />
        )}
      </div>
    </ScrollArea>
  );
}
