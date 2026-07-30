import dotenv from "dotenv";
dotenv.config();

export const config = {
  token: process.env.DISCORD_TOKEN || "",
  clientId: process.env.CLIENT_ID || "",
  guildId: process.env.GUILD_ID || "1531378981805232128",
  githubUrl: process.env.GITHUB_REPO_URL || "https://github.com/Eren-Jaeger-DEV/Atlas",
  
  // Mapped Server Channels
  channels: {
    welcome: "1531385523850182907",
    announcements: "1531385700803674223",
    aboutUs: "1531387160429592637",
    rules: "1531387240918552709",
    general: "1531386185434267749",
    botCommands: "1531400738058539209",
    help: "1531390768130953286",
    bugReport: "1531390649696260298",
    githubFeed: "1531390393776738504",
    changelog: "1531390453079998534",
    devLog: "1531390211223851040",
    pluginShowcase: "1531394730137620591"
  },

  colors: {
    primary: 0x38bdf8, // Sky Blue / Atlas Accent
    success: 0x22c55e, // Green
    warning: 0xf59e0b, // Amber
    error: 0xef4444,   // Red
    dark: 0x0c0c0e     // Stealth Dark
  }
};
