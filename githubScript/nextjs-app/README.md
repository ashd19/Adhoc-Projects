# GitHub Unfollow Tool

A modern, safe, and user-friendly web application to help you unfollow GitHub users who don't follow you back.

## Features

- 🔒 **Secure Authentication** - Uses your GitHub personal access token
- 👤 **Whitelist Protection** - Protect specific users from being unfollowed
- 📊 **Progress Tracking** - Real-time progress updates during processing
- ✅ **Confirmation Dialog** - Review users before unfollowing
- 📈 **Detailed Results** - See exactly what happened after processing
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- A GitHub personal access token with appropriate permissions

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

### GitHub Token Setup

1. Go to [GitHub Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select the following scopes:
   - `user:follow` (to read and modify following relationships)
   - `read:user` (to read basic user information)
4. Copy the generated token and paste it into the application

## How It Works

1. **Authentication**: Enter your GitHub personal access token
2. **Whitelist** (Optional): Add usernames you never want to unfollow
3. **Review**: See who will be unfollowed and confirm the action
4. **Process**: Watch real-time progress as users are unfollowed
5. **Results**: Review the final results and start over if needed

## Safety Features

- Rate limiting and retry logic to avoid hitting GitHub's API limits
- Confirmation dialogs to prevent accidental actions
- Whitelist protection for important accounts
- Detailed error reporting

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: shadcn/ui, Radix UI
- **Styling**: Tailwind CSS
- **GitHub API**: Octokit/core
- **Icons**: Lucide React

## License

MIT License
