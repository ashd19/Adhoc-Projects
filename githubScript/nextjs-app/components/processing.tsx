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
import { Progress } from "@/components/ui/progress";
import { UnfollowResult } from "@/lib/github";
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";

interface ProcessingProps {
  isProcessing: boolean;
  progress: { current: number; total: number; username: string } | null;
  result: UnfollowResult | null;
  onReset: () => void;
}

export function Processing({
  isProcessing,
  progress,
  result,
  onReset,
}: ProcessingProps) {
  if (isProcessing) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing Unfollows
          </CardTitle>
          <CardDescription>
            Please wait while we unfollow users who don't follow you back
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {progress && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Processing:{" "}
                  <span className="font-medium">{progress.username}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {progress.current} of {progress.total}
                </p>
              </div>

              <Progress
                value={progress.current}
                max={progress.total}
                className="w-full"
              />
            </div>
          )}

          <div className="text-center text-sm text-muted-foreground">
            This may take a few minutes depending on the number of users...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (result) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {result.success ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive" />
            )}
            {result.success
              ? "Completed Successfully!"
              : "Completed with Issues"}
          </CardTitle>
          <CardDescription>{result.message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">
                {result.unfollowedUsers.length}
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Successfully Unfollowed
              </p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-red-600">
                {result.failedUsers.length}
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">Failed</p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">
                {result.totalProcessed}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Total Processed
              </p>
            </div>
          </div>

          {result.unfollowedUsers.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-green-600">
                Successfully unfollowed:
              </h3>
              <div className="max-h-32 overflow-y-auto bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <div className="flex flex-wrap gap-1">
                  {result.unfollowedUsers.map((username) => (
                    <span
                      key={username}
                      className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs"
                    >
                      {username}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {result.failedUsers.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-red-600">
                Failed to unfollow:
              </h3>
              <div className="max-h-32 overflow-y-auto bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <div className="space-y-1">
                  {result.failedUsers.map((failure) => (
                    <div key={failure.username} className="text-xs">
                      <span className="font-medium text-red-800 dark:text-red-200">
                        {failure.username}
                      </span>
                      <span className="text-red-600 dark:text-red-400">
                        {" "}
                        - {failure.error}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Button onClick={onReset} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Start Over
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
}
