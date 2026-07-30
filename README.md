# Atlas Discord Community Bot

Official Discord Bot for the **Atlas Studio IDE** community server.

## Features
- 🚀 `/atlas info`: Interactive overview of Atlas Studio IDE with GitHub links.
- 📖 `/atlas docs <topic>`: Architecture & setup documentation search directly in Discord.
- 🩺 `/atlas doctor`: Instant troubleshooter for setup, Node, pnpm & Electron build issues.
- 📦 `/atlas release`: Latest release details and download links.
- 👋 **Welcome System**: Dark-themed welcome embeds for new server members.

## Setup Instructions

### 1. Installation
```bash
cd "/home/victor/My projects/atlas-bot"
pnpm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in your Discord Bot credentials:
```bash
cp .env.example .env
```
Edit `.env`:
```env
DISCORD_TOKEN=your_bot_token_from_discord_developer_portal
CLIENT_ID=your_application_client_id
GUILD_ID=your_discord_server_id
WELCOME_CHANNEL_ID=your_welcome_channel_id
```

### 3. Register Slash Commands
```bash
pnpm run register
```

### 4. Run the Bot
```bash
# Development (with hot-reload)
pnpm run dev

# Production
pnpm run build
pnpm start
```

## Legal & Compliance
- 📄 [Terms of Service](TERMS.md)
- 🔒 [Privacy Policy](PRIVACY.md)

