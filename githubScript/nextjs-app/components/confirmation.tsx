"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { GitHubUser } from "@/lib/github";
import { Users, UserMinus, AlertTriangle } from "lucide-react";

interface ConfirmationProps {
  candidates: GitHubUser[];
  whitelist: string[];
  onConfirm: () => void;
  onBack: () => void;
}

export function Confirmation({
  candidates,
  whitelist,
  onConfirm,
  onBack,
}: ConfirmationProps) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <UserMinus className="h-5 w-5" />
          Confirm Unfollow Action
        </CardTitle>
        <CardDescription>
          Review the users who will be unfollowed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <UserMinus className="h-4 w-4 text-destructive" />
              <span className="font-medium">To Unfollow</span>
            </div>
            <p className="text-2xl font-bold text-destructive">
              {candidates.length}
            </p>
            <p className="text-sm text-muted-foreground">users</p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-green-600" />
              <span className="font-medium">Whitelisted</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {whitelist.length}
            </p>
            <p className="text-sm text-muted-foreground">users</p>
          </div>
        </div>

        {candidates.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Users to unfollow:</h3>
            <div className="max-h-48 overflow-y-auto bg-muted p-3 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {candidates.map((user) => (
                  <div
                    key={user.login}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <img
                      src={user.avatar_url}
                      alt={user.login}
                      className="h-6 w-6 rounded-full"
                    />
                    <span>{user.login}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {whitelist.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-green-600">
              Protected users:
            </h3>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <div className="flex flex-wrap gap-2">
                {whitelist.map((username) => (
                  <span
                    key={username}
                    className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded text-sm"
                  >
                    {username}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            This action cannot be undone. Users will be unfollowed immediately.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="flex-1"
                disabled={candidates.length === 0}
              >
                Start Unfollowing ({candidates.length})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  You are about to unfollow {candidates.length} users who don't
                  follow you back. This action cannot be undone and you'll need
                  to manually follow them again if desired.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onConfirm}>
                  Yes, unfollow them
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
