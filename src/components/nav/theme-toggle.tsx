"use client";

import { useTheme } from "next-themes";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { SunIcon, MoonIcon } from "lucide-react";

export function ToggleTheme() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenuItem
      onClick={() => (theme === "light" ? setTheme("dark") : setTheme("light"))}
    >
      {theme === "light" ? <SunIcon /> : <MoonIcon />}
      Theme
    </DropdownMenuItem>
  );
}
