import dotenv from "dotenv";
dotenv.config();

export const config = {
  token: process.env.DISCORD_TOKEN || "",
  clientId: process.env.CLIENT_ID || "",
  guildId: process.env.GUILD_ID || "",
  welcomeChannelId: process.env.WELCOME_CHANNEL_ID || "",
  announcementsChannelId: process.env.ANNOUNCEMENTS_CHANNEL_ID || "",
  githubUrl: process.env.GITHUB_REPO_URL || "https://github.com/Eren-Jaeger-DEV/Atlas",
  colors: {
    primary: 0x38bdf8, // Sky Blue / Atlas Accent
    success: 0x22c55e, // Green
    warning: 0xf59e0b, // Amber
    error: 0xef4444,   // Red
    dark: 0x0c0c0e     // Stealth Dark
  }
};
