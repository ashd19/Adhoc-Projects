import { Octokit } from "@octokit/core";

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

export interface UnfollowResult {
  success: boolean;
  message: string;
  unfollowedUsers: string[];
  failedUsers: { username: string; error: string }[];
  totalProcessed: number;
}

export class GitHubService {
  private octokit: Octokit;

  constructor(token: string) {
    this.octokit = new Octokit({ auth: token });
  }

  async validateToken(): Promise<{ valid: boolean; user?: GitHubUser }> {
    try {
      const { data } = await this.octokit.request("GET /user", {
        headers: { "X-GitHub-Api-Version": "2022-11-28" },
      });
      return { valid: true, user: data };
    } catch (error) {
      return { valid: false };
    }
  }

  async paginatedList(endpoint: string, perPage = 100): Promise<GitHubUser[]> {
    const results: GitHubUser[] = [];
    let page = 1;
    perPage = Math.min(perPage, 100);

    while (true) {
      const { data } = await this.octokit.request(endpoint, {
        per_page: perPage,
        page,
        headers: { "X-GitHub-Api-Version": "2022-11-28" },
      });

      if (!Array.isArray(data)) break;
      results.push(...data);
      if (data.length < perPage) break;
      page += 1;
    }
    return results;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async attemptDeleteFollow(
    username: string,
    maxRetries = 3
  ): Promise<{ ok: boolean; error?: string }> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.octokit.request("DELETE /user/following/{username}", {
          username,
          headers: { "X-GitHub-Api-Version": "2022-11-28" },
        });
        return { ok: true };
      } catch (err: any) {
        const status = err.status || (err.response && err.response.status);

        if (status === 403 || status === 429) {
          const retryAfter = Number(
            err.response?.headers?.["retry-after"] || 0
          );
          const backoffMs =
            retryAfter > 0 ? retryAfter * 1000 : Math.pow(2, attempt) * 1000;
          await this.sleep(backoffMs);
          continue;
        }

        await this.sleep(Math.pow(2, attempt) * 500);
      }
    }
    return { ok: false, error: `Failed after ${maxRetries} attempts` };
  }

  async getUnfollowCandidates(whitelist: string[] = []): Promise<{
    user: GitHubUser;
    followers: GitHubUser[];
    following: GitHubUser[];
    notFollowingBack: GitHubUser[];
  }> {
    const { data: user } = await this.octokit.request("GET /user", {
      headers: { "X-GitHub-Api-Version": "2022-11-28" },
    });

    const [followers, following] = await Promise.all([
      this.paginatedList("GET /user/followers", 100),
      this.paginatedList("GET /user/following", 100),
    ]);

    const followerLogins = new Set(followers.map((u) => u.login));
    const notFollowingBack = following.filter(
      (u) => !followerLogins.has(u.login) && !whitelist.includes(u.login)
    );

    return { user, followers, following, notFollowingBack };
  }

  async unfollowUsers(
    users: GitHubUser[],
    whitelist: string[] = [],
    delayMs = 1000,
    onProgress?: (progress: {
      current: number;
      total: number;
      username: string;
    }) => void
  ): Promise<UnfollowResult> {
    const unfollowedUsers: string[] = [];
    const failedUsers: { username: string; error: string }[] = [];

    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      if (whitelist.includes(user.login)) {
        continue;
      }

      onProgress?.({
        current: i + 1,
        total: users.length,
        username: user.login,
      });

      const result = await this.attemptDeleteFollow(user.login);

      if (result.ok) {
        unfollowedUsers.push(user.login);
      } else {
        failedUsers.push({
          username: user.login,
          error: result.error || "Unknown error",
        });
      }

      if (i < users.length - 1) {
        await this.sleep(delayMs);
      }
    }

    return {
      success: failedUsers.length === 0,
      message: `Processed ${users.length} users. Unfollowed: ${unfollowedUsers.length}, Failed: ${failedUsers.length}`,
      unfollowedUsers,
      failedUsers,
      totalProcessed: users.length,
    };
  }
}
