import { Client, GatewayIntentBits, Events } from "discord.js";
import { config } from "./config.js";
import { execute as executeAtlasCommand } from "./commands/atlas.js";
import { handleGuildMemberAdd } from "./events/guildMemberAdd.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once(Events.ClientReady, (c) => {
  console.log(`[PASS] Atlas Discord Bot is online and logged in as ${c.user.tag}!`);
  client.user?.setActivity("Atlas Studio IDE v1.0.0", { type: 0 }); // Playing
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "atlas") {
    try {
      await executeAtlasCommand(interaction);
    } catch (error) {
      console.error(`[ERROR] Command /atlas failed:`, error);
      const replyFn = interaction.replied || interaction.deferred ? interaction.followUp : interaction.reply;
      await replyFn.call(interaction, {
        content: "There was an error executing this command!",
        ephemeral: true
      });
    }
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
