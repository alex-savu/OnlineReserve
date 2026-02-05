import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { useAuth } from "@/app/contexts/auth-context";
import { User, LogOut, Calendar, Settings, Shield } from "lucide-react";

interface UserMenuProps {
  onViewBookings?: () => void;
  onViewSettings?: () => void;
  onViewAdmin?: () => void;
}

export function UserMenu({ onViewBookings, onViewSettings, onViewAdmin }: UserMenuProps) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (!user) return null;

  const initials = user.user_metadata?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || user.email?.slice(0, 2).toUpperCase();

  // Check if user is admin or hostel-admin
  const isAdmin = user.user_metadata?.role === "admin";
  const isHostelAdmin = user.user_metadata?.role === "hostel-admin";
  const hasAdminAccess = isAdmin || isHostelAdmin;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.user_metadata?.name || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {hasAdminAccess && (
          <>
            <DropdownMenuItem onClick={onViewAdmin}>
              <Shield className="mr-2 h-4 w-4" />
              <span>Panou Admin</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={onViewBookings}>
          <Calendar className="mr-2 h-4 w-4" />
          <span>Rezervările mele</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onViewSettings}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Setări cont</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Deconectare</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}