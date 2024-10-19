"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  HomeIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import { useTheme } from "next-themes";

export function Navbar() {
  const { theme, setTheme } = useTheme()
  return (
    <>
      <header className="w-full fixed">
        <nav className="flex justify-between p-5 items-center">
          <Link href={"/"} className="text-lg font-extrabold md:text-base">
            A.
          </Link>

          <div className="flex items-center gap-2">
            <div>
              <DropdownMenu >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden"
                  >
                    <MenuIcon className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href={"/"}>
                    <DropdownMenuItem>
                      Home
                      <DropdownMenuShortcut>
                        <HomeIcon className="w-4 h-4" />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={() => theme === "light" ? setTheme("dark") : setTheme("light")}>
                    Theme
                    <DropdownMenuShortcut>
                      {theme === "light" ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
