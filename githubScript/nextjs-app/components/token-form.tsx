"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GitHubService, GitHubUser } from "@/lib/github";
import { Key, Loader2 } from "lucide-react";

interface TokenFormProps {
  onTokenSubmit: (token: string, user: GitHubUser) => void;
}

export function TokenForm({ onTokenSubmit }: TokenFormProps) {
  const [token, setToken] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setError("Please enter a token");
      return;
    }

    setIsValidating(true);
    setError("");

    try {
      const service = new GitHubService(token.trim());
      const result = await service.validateToken();

      if (result.valid && result.user) {
        onTokenSubmit(token.trim(), result.user);
      } else {
        setError(
          "Invalid token. Please check your GitHub personal access token."
        );
      }
    } catch (err) {
      setError("Failed to validate token. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Key className="h-5 w-5" />
          GitHub Authentication
        </CardTitle>
        <CardDescription>
          Enter your GitHub personal access token to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="token" className="text-sm font-medium">
              Personal Access Token
            </label>
            <Input
              id="token"
              type="password"
              placeholder="ghp_xxxxxxxxxxxx"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={isValidating}
            />
            <p className="text-xs text-muted-foreground">
              Need a token?{" "}
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Create one here
              </a>
            </p>
          </div>

          {error && <div className="text-sm text-destructive">{error}</div>}

          <Button
            type="submit"
            className="w-full"
            disabled={isValidating || !token.trim()}
          >
            {isValidating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              "Authenticate"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
