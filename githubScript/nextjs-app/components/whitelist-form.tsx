"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GitHubUser } from "@/lib/github";
import { X, Plus } from "lucide-react";

interface WhitelistFormProps {
  onNext: (whitelist: string[]) => void;
  user: GitHubUser;
}

export function WhitelistForm({ onNext, user }: WhitelistFormProps) {
  const [whitelist, setWhitelist] = React.useState<string[]>([]);
  const [newUser, setNewUser] = React.useState("");

  const addUser = () => {
    if (newUser.trim() && !whitelist.includes(newUser.trim())) {
      setWhitelist([...whitelist, newUser.trim()]);
      setNewUser("");
    }
  };

  const removeUser = (userToRemove: string) => {
    setWhitelist(whitelist.filter((u) => u !== userToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addUser();
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle>Whitelist Users</CardTitle>
        <CardDescription>
          Add users you never want to unfollow (optional)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex space-x-2">
          <Input
            placeholder="Enter GitHub username"
            value={newUser}
            onChange={(e) => setNewUser(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button onClick={addUser} disabled={!newUser.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {whitelist.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Whitelisted Users:</h3>
            <div className="flex flex-wrap gap-2">
              {whitelist.map((username) => (
                <div
                  key={username}
                  className="flex items-center space-x-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                >
                  <span>{username}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeUser(username)}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Logged in as: <span className="font-medium">{user.login}</span>
          </div>
        </div>

        <Button onClick={() => onNext(whitelist)} className="w-full">
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}
