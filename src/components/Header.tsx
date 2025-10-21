import { Moon, Sun, Share2, Bell, Settings, Menu, Feather } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface HeaderProps {
  theme: "light" | "dark";
  onThemeToggle: () => void;
  onMobileMenuToggle?: () => void;
  currentStoryTitle?: string;
}

export function Header({
  theme,
  onThemeToggle,
  onMobileMenuToggle,
  currentStoryTitle,
}: HeaderProps) {
  return (
    <header className="border-b border-border/30 glass backdrop-blur-xl">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Left - Branding and Current Story */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Feather className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-foreground" style={{ fontSize: "1.125rem" }}>
                MysticWriter
              </h1>
            </div>
          </div>
          {currentStoryTitle && (
            <>
              <div className="hidden md:block w-px h-6 bg-border/50"></div>
              <div className="hidden md:block min-w-0">
                <p
                  className="text-muted-foreground truncate"
                  style={{ fontSize: "0.875rem" }}
                >
                  {currentStoryTitle}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-full h-9 w-9"
            onClick={onMobileMenuToggle}
          >
            <Menu className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex rounded-full h-9 w-9"
          >
            <Bell className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex rounded-full h-9 w-9"
          >
            <Share2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onThemeToggle}
            className="rounded-full h-9 w-9"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex rounded-full h-9 w-9"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              U
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
