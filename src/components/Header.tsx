import { Moon, Sun, Share2, Bell, Menu, Feather, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { ProfileDropdown } from "./ProfileDropdown";

interface HeaderProps {
  theme: "light" | "dark" | "system";
  onThemeToggle: () => void;
  onMobileMenuToggle?: () => void;
  currentStoryTitle?: string;
  temperature?: number;
  onTemperatureChange?: (temp: number) => void;
  onThemeChange?: (theme: "light" | "dark" | "system") => void;
}

export function Header({
  theme,
  onThemeToggle,
  onMobileMenuToggle,
  currentStoryTitle,
  temperature = 0.7,
  onTemperatureChange,
  onThemeChange,
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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-9 w-9"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="glass backdrop-blur-xl w-80 mr-2 z-50"
              align="end"
            >
              <div className="space-y-4">
                {/* Temperature Setting */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">Temperature</Label>
                    <span className="text-sm text-purple-400 font-bold bg-purple-500/20 px-3 py-1 rounded-full">
                      {temperature.toFixed(1)}
                    </span>
                  </div>
                  <div className="px-2 py-3 bg-gradient-to-r from-purple-400/10 to-purple-600/10 rounded-lg">
                    <Slider
                      min={0}
                      max={2}
                      step={0.1}
                      value={[temperature]}
                      onValueChange={(value) => onTemperatureChange?.(value[0])}
                      className="w-full cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground leading-tight text-center">
                    Focused • Balanced • Creative
                  </p>
                </div>

                {/* Theme Setting */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Theme</Label>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => onThemeChange?.("light")}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        theme === "light"
                          ? "border-purple-500 bg-purple-500/20 text-purple-400"
                          : "border-border/30 hover:border-border/50 text-muted-foreground hover:text-foreground"
                      }`}
                      title="Light Theme"
                    >
                      <Sun className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => onThemeChange?.("dark")}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        theme === "dark"
                          ? "border-purple-500 bg-purple-500/20 text-purple-400"
                          : "border-border/30 hover:border-border/50 text-muted-foreground hover:text-foreground"
                      }`}
                      title="Dark Theme"
                    >
                      <Moon className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
