"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { TokenForm } from "@/components/token-form";
import { WhitelistForm } from "@/components/whitelist-form";
import { Confirmation } from "@/components/confirmation";
import { Processing } from "@/components/processing";
import { GitHubService, GitHubUser, UnfollowResult } from "@/lib/github";

type Step = "token" | "whitelist" | "confirmation" | "processing";

export default function Home() {
  const [step, setStep] = useState<Step>("token");
  const [service, setService] = useState<GitHubService | null>(null);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const [candidates, setCandidates] = useState<GitHubUser[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{
    current: number;
    total: number;
    username: string;
  } | null>(null);
  const [result, setResult] = useState<UnfollowResult | null>(null);

  const handleTokenSubmit = (token: string, userData: GitHubUser) => {
    setService(new GitHubService(token));
    setUser(userData);
    setStep("whitelist");
  };

  const handleWhitelistNext = (whitelistUsers: string[]) => {
    setWhitelist(whitelistUsers);
    fetchCandidates(whitelistUsers);
  };

  const fetchCandidates = async (whitelistUsers: string[]) => {
    if (!service) return;

    try {
      const data = await service.getUnfollowCandidates(whitelistUsers);
      setCandidates(data.notFollowingBack);
      setStep("confirmation");
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
    }
  };

  const handleConfirm = async () => {
    if (!service) return;

    setStep("processing");
    setIsProcessing(true);
    setProgress(null);
    setResult(null);

    try {
      const unfollowResult = await service.unfollowUsers(
        candidates,
        whitelist,
        1000, // 1 second delay
        (progressInfo) => setProgress(progressInfo)
      );

      setResult(unfollowResult);
    } catch (error) {
      setResult({
        success: false,
        message: "An error occurred during processing",
        unfollowedUsers: [],
        failedUsers: [],
        totalProcessed: 0,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setStep("token");
    setService(null);
    setUser(null);
    setWhitelist([]);
    setCandidates([]);
    setIsProcessing(false);
    setProgress(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          {step === "token" && <TokenForm onTokenSubmit={handleTokenSubmit} />}

          {step === "whitelist" && user && (
            <WhitelistForm onNext={handleWhitelistNext} user={user} />
          )}

          {step === "confirmation" && (
            <Confirmation
              candidates={candidates}
              whitelist={whitelist}
              onConfirm={handleConfirm}
              onBack={() => setStep("whitelist")}
            />
          )}

          {step === "processing" && (
            <Processing
              isProcessing={isProcessing}
              progress={progress}
              result={result}
              onReset={handleReset}
            />
          )}
        </div>
      </main>
    </div>
  );
}
