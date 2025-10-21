import { Moon, Sun, Share2, Bell, Settings, Menu, Feather } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface HeaderProps {
  theme: "light" | "dark";
  onThemeToggle: () => void;
  onMobileMenuToggle?: () => void;
}

export function Header({ theme, onThemeToggle, onMobileMenuToggle }: HeaderProps) {
  return (
    <header className="border-b border-border/30 glass backdrop-blur-xl">
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Feather className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-foreground">MysticWriter</h1>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              Collaborative Creative Writing
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-full"
            onClick={onMobileMenuToggle}
          >
            <Menu className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full">
            <Bell className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onThemeToggle}
            className="rounded-full"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full">
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
