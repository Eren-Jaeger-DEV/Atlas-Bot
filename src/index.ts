import { Client, GatewayIntentBits, Events } from "discord.js";
import { config } from "./config.js";
import { execute as executeAtlasCommand } from "./commands/atlas.js";
import { CommandContext } from "./utils/CommandContext.js";
import { handleGuildMemberAdd } from "./events/guildMemberAdd.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const PREFIXES = ["A!", "a!"];

client.once(Events.ClientReady, (c) => {
  console.log(`[PASS] Atlas Discord Bot is online and logged in as ${c.user.tag}!`);
  client.user?.setActivity("Atlas Studio IDE v1.0.0 (A!help)", { type: 0 });
});

// Slash Commands Handler
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "atlas") {
    try {
      const ctx = new CommandContext({ interaction });
      await executeAtlasCommand(ctx);
    } catch (error) {
      console.error(`[ERROR] Slash command /atlas failed:`, error);
      const replyFn = interaction.replied || interaction.deferred ? interaction.followUp : interaction.reply;
      await replyFn.call(interaction, {
        content: "There was an error executing this command!",
        ephemeral: true
      });
    }
  }
});

// Prefix Commands Handler (A! and a!)
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  const content = message.content.trim();
  const matchedPrefix = PREFIXES.find(p => content.startsWith(p));
  if (!matchedPrefix) return;

  // Remove prefix and split arguments
  const rawWithoutPrefix = content.slice(matchedPrefix.length).trim();
  if (!rawWithoutPrefix) return;

  const parts = rawWithoutPrefix.split(/\s+/);
  const commandName = parts[0].toLowerCase();
  const args = parts.slice(1);

  try {
    if (commandName === "atlas") {
      const ctx = new CommandContext({ message, args });
      await executeAtlasCommand(ctx);
    } else if (["info", "docs", "doctor", "release", "stats"].includes(commandName)) {
      // Alias shortcuts: e.g. A!info, a!docs, A!doctor, a!release, A!stats
      const ctx = new CommandContext({ message, args: [commandName, ...args] });
      await executeAtlasCommand(ctx);
    } else if (commandName === "help") {
      const ctx = new CommandContext({ message, args: ["info"] });
      await executeAtlasCommand(ctx);
    }
  } catch (error) {
    console.error(`[ERROR] Prefix command ${matchedPrefix}${commandName} failed:`, error);
    await message.reply("There was an error executing this command!");
  }
});

client.on(Events.GuildMemberAdd, async (member) => {
  try {
    await handleGuildMemberAdd(member);
  } catch (error) {
    console.error(`[ERROR] Welcome event failed for ${member.displayName}:`, error);
  }
});

if (!config.token) {
  console.error("[ERROR] DISCORD_TOKEN is missing in .env! Please configure your token.");
  process.exit(1);
}

client.login(config.token);
