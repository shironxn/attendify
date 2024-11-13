"use client"

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  HomeIcon,
  MenuIcon,
} from "lucide-react";
import { DashboardIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";
import { ToggleTheme } from "./theme-toggle";

export function Navbar() {
  const pathname = usePathname()
  return (
    <>
      {pathname !== "/dashboard" &&
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
                      <MenuIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <Link href={"/"}>
                      <DropdownMenuItem>
                        <HomeIcon />
                        Home
                      </DropdownMenuItem>
                    </Link>
                    <Link href={"/dashboard"}>
                      <DropdownMenuItem>
                        <DashboardIcon />
                        Dashboard
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <ToggleTheme />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </nav>
        </header>
      }</>
  );
}
