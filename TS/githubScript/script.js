// Octokit.js
// https://github.com/octokit/core.js#readme
import { Octokit } from "@octokit/core";
import "dotenv/config";

const octokit = new Octokit({
  auth: process.env.TOKEN,
});

const { data } = await octokit.request("GET /user", {
  headers: { "X-GitHub-Api-Version": "2022-11-28" },
});

console.log(data.followers);
console.log(data.following);

const notFollowingBack = [];
const handlelogic = () => {
  if (data.followers.login != data.followers.login) {
    notFollowingBack.push(data.followers.login);
  }
};
handlelogic();

console.log(notFollowingBack);
