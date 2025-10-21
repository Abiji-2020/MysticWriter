import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

export function ProfileDropdown() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const initials =
    user.nickname
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ||
    user.email?.charAt(0).toUpperCase() ||
    "U";

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-10 w-10 hover:bg-purple-500/10"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 glass backdrop-blur-xl">
        {/* User Info */}
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium text-foreground">
            {user.nickname || "User"}
          </p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>

        <DropdownMenuSeparator className="bg-border/30" />

        {/* Profile Option */}
        <DropdownMenuItem className="cursor-pointer gap-2">
          <User className="w-4 h-4" />
          <span>View Profile</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-border/30" />

        {/* Logout */}
        <DropdownMenuItem
          onClick={() => {
            logout();
            setOpen(false);
          }}
          className="cursor-pointer gap-2 text-red-400 hover:text-red-300 focus:text-red-300"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileDropdown;
