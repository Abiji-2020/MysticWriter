import { Clock, FileText, Users, MoreVertical } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface StoryHeaderProps {
  title: string;
  timestamp: string;
  isActive: boolean;
  wordCount: number;
  characterCount: number;
}

export function StoryHeader({
  title,
  timestamp,
  isActive,
  wordCount,
  characterCount,
}: StoryHeaderProps) {
  return (
    <div className="p-6 border-b border-border/30 glass backdrop-blur-xl">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-foreground mb-3">{title}</h2>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground" style={{ fontSize: '0.875rem' }}>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 dark:text-purple-400 text-purple-600" />
              <span>Started {timestamp}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 dark:text-blue-400 text-blue-600" />
              <span>{wordCount.toLocaleString()} words</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 dark:text-emerald-400 text-emerald-600" />
              <span>{characterCount} characters</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isActive && (
            <Badge
              variant="secondary"
              className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/20"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              Active Session
            </Badge>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
