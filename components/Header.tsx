"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "./ui/dropdown-menu";
import { User, LogOut, Palette, Sparkles, Moon, Sun } from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b-2 border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📋</span>
          <h1 className="text-xl font-bold text-foreground">My To Do List Board</h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden md:block">
            ✨ Organize • Focus • Achieve
          </span>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 bg-primary/10 hover:bg-primary/20">
                <User className="h-5 w-5 text-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {session?.user?.name || "Guest User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session?.user?.email || "guest@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Theme Selection */}
              <DropdownMenuLabel className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Theme
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as "retro" | "professional" | "light")}>
                <DropdownMenuRadioItem value="retro" className="cursor-pointer">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Retro (Bubblegum)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="professional" className="cursor-pointer">
                  <Moon className="h-4 w-4 mr-2" />
                  Professional (Dark)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="light" className="cursor-pointer">
                  <Sun className="h-4 w-4 mr-2" />
                  Light (Bright)
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
