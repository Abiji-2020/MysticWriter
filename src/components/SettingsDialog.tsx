import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Settings, Sun, Moon } from "lucide-react";

interface SettingsPopoverProps {
  temperature: number;
  onTemperatureChange: (temp: number) => void;
  theme: "light" | "dark" | "system";
  onThemeChange: (theme: "light" | "dark" | "system") => void;
}

export function SettingsPopover({
  temperature,
  onTemperatureChange,
  theme,
  onThemeChange,
}: SettingsPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
          <Settings className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="glass backdrop-blur-xl w-80 mr-2" align="end">
        <div className="space-y-4">
          {/* Temperature Setting */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">AI Temperature</Label>
              <span className="text-xs text-purple-400 font-medium bg-purple-500/10 px-2 py-1 rounded">
                {temperature.toFixed(1)}
              </span>
            </div>
            <Slider
              min={0}
              max={2}
              step={0.1}
              value={[temperature]}
              onValueChange={(value) => onTemperatureChange(value[0])}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground leading-tight">
              Lower = focused • Higher = creative
            </p>
          </div>

          {/* Theme Setting */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Theme</Label>
            <div className="flex gap-2">
              <button
                onClick={() => onThemeChange("light")}
                className={`flex-1 p-2 rounded-lg border transition-all flex items-center justify-center gap-1 ${
                  theme === "light"
                    ? "border-purple-500 bg-purple-500/10 text-purple-400"
                    : "border-border/30 hover:border-border/50"
                }`}
              >
                <Sun className="w-4 h-4" />
                <span className="text-xs">Light</span>
              </button>
              <button
                onClick={() => onThemeChange("dark")}
                className={`flex-1 p-2 rounded-lg border transition-all flex items-center justify-center gap-1 ${
                  theme === "dark"
                    ? "border-purple-500 bg-purple-500/10 text-purple-400"
                    : "border-border/30 hover:border-border/50"
                }`}
              >
                <Moon className="w-4 h-4" />
                <span className="text-xs">Dark</span>
              </button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default SettingsPopover;
