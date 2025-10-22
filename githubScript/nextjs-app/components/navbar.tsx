"use client";

import React from "react";
import { Github, Users, UserMinus } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center space-x-2">
          <Github className="h-6 w-6" />
          <span className="font-semibold">GitHub Unfollow Tool</span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Clean up your following list</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
