// Octokit core usage - safer unfollow script with pagination, dry-run, delay and retries
import { Octokit } from "@octokit/core";
import "dotenv/config";

const TOKEN = process.env.TOKEN;
if (!TOKEN) {
  console.error(
    "ERROR: set TOKEN in env (a GitHub personal access token with appropriate scope)."
  );
  process.exit(1);
}

const DRY_RUN = process.env.DRY_RUN  !== "false"; 
const DELAY_MS = Number(process.env.DELAY_MS || 1000); // delay between unfollows
const MAX_RETRIES = Number(process.env.MAX_RETRIES || 3);
const WHITELIST = (process.env.WHITELIST || "") // comma-separated logins to never unfollow
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const octokit = new Octokit({ auth: TOKEN });

async function paginatedList(endpoint, perPage = 100) {
  // endpoint should be like "GET /user/followers" or "GET /user/following"
  const results = [];
  let page = 1;
  perPage = Math.min(perPage, 100);
  while (true) {
    const { data } = await octokit.request(`${endpoint}`, {
      per_page: perPage,
      page,
      headers: { "X-GitHub-Api-Version": "2022-11-28" },
    });
    if (!Array.isArray(data)) break; // unexpected
    results.push(...data);
    if (data.length < perPage) break; // last page
    page += 1;
  }
  return results;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function attemptDeleteFollow(username) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await octokit.request("DELETE /user/following/{username}", {
        username,
        headers: { "X-GitHub-Api-Version": "2022-11-28" },
      });
      return { ok: true };
    } catch (err) {
      const status = err.status || (err.response && err.response.status);
      // If rate-limited, respect Retry-After if present otherwise exponential backoff
      if (status === 403 || status === 429) {
        const retryAfter = Number(err.response?.headers?.["retry-after"] || 0);
        const backoffMs =
          retryAfter > 0 ? retryAfter * 1000 : Math.pow(2, attempt) * 1000;
        console.warn(
          `Rate limit / throttled when unfollowing ${username}. backing off ${backoffMs}ms (attempt ${attempt})`
        );
        await sleep(backoffMs);
        continue;
      }
      // For other errors, log and retry with small backoff
      console.warn(
        `Attempt ${attempt} failed for ${username}: ${err.message || err}.`
      );
      await sleep(Math.pow(2, attempt) * 500);
    }
  }
  return { ok: false, error: `Failed after ${MAX_RETRIES} attempts` };
}

async function main() {
  // get authenticated user info (counts)
  const { data: me } = await octokit.request("GET /user", {
    headers: { "X-GitHub-Api-Version": "2022-11-28" },
  });
  console.log(
    `Authenticated as: ${me.login}. followers: ${me.followers}, following: ${me.following}`
  );

  // fetch full lists with pagination (per_page <= 100)
  console.log("Fetching followers...");
  const followers = await paginatedList("GET /user/followers", 100);
  console.log(`Fetched ${followers.length} followers.`);

  console.log("Fetching following...");
  const following = await paginatedList("GET /user/following", 100);
  console.log(`Fetched ${following.length} following.`);

  const followerLogins = new Set(followers.map((u) => u.login));
  const notFollowingBack = following.filter(
    (u) => !followerLogins.has(u.login) && !WHITELIST.includes(u.login)
  );

  console.log(
    `Users you follow who don't follow back (${notFollowingBack.length}):`
  );
  console.log(notFollowingBack.map((u) => u.login).join(", ") || "(none)");

  if (notFollowingBack.length === 0) {
    console.log("Nothing to do. Exiting.");
    return;
  }

  if (DRY_RUN) {
    console.log("DRY_RUN enabled. No unfollow requests will be made.");
    console.log("To actually unfollow, set DRY_RUN=false in the environment.");
    return;
  }

  // proceed to unfollow sequentially with delay and retries
  for (const user of notFollowingBack) {
    if (WHITELIST.includes(user.login)) {
      console.log(`Skipping whitelisted user: ${user.login}`);
      continue;
    }
    console.log(`Unfollowing ${user.login}...`);
    const res = await attemptDeleteFollow(user.login);
    if (res.ok) {
      console.log(`✓ Unfollowed ${user.login}`);
    } else {
      console.error(`✗ Failed to unfollow ${user.login}: ${res.error}`);
    }
    await sleep(DELAY_MS);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
