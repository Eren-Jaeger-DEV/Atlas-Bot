import { Client, GatewayIntentBits, ChannelType } from "discord.js";
import { config } from "./config.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", async (c) => {
  console.log(`[MAPPER] Logged in as ${c.user.tag}`);
  
  try {
    const guildId = config.guildId;
    if (!guildId) {
      console.error("[MAPPER] GUILD_ID is not configured in .env!");
      process.exit(1);
    }

    const guild = await client.guilds.fetch(guildId);
    console.log(`\n========================================`);
    console.log(`GUILD NAME: ${guild.name} (ID: ${guild.id})`);
    console.log(`MEMBER COUNT: ${guild.memberCount}`);
    console.log(`OWNER ID: ${guild.ownerId}`);
    console.log(`========================================\n`);

    // Fetch channels
    const channels = await guild.channels.fetch();
    console.log(`--- CHANNELS (${channels.size}) ---`);
    
    // Group channels by categories
    const categories = channels.filter(c => c && c.type === ChannelType.GuildCategory);
    const nonCategorized = channels.filter(c => c && !c.parentId && c.type !== ChannelType.GuildCategory);

    console.log(`\n[UNCATEGORIZED CHANNELS]`);
    nonCategorized.forEach(ch => {
      console.log(`  - #${ch?.name} (ID: ${ch?.id}, Type: ${ch?.type})`);
    });

    categories.forEach(cat => {
      console.log(`\n📁 CATEGORY: ${cat?.name} (ID: ${cat?.id})`);
      const childChannels = channels.filter(c => c && c.parentId === cat?.id);
      childChannels.forEach(ch => {
        const typeName = ch?.type === ChannelType.GuildText ? "Text" : ch?.type === ChannelType.GuildVoice ? "Voice" : ch?.type === ChannelType.GuildAnnouncement ? "Announcement" : "Other";
        console.log(`  └─ #${ch?.name} (ID: ${ch?.id}, Type: ${typeName})`);
      });
    });

    // Fetch roles
    const roles = await guild.roles.fetch();
    console.log(`\n--- ROLES (${roles.size}) ---`);
    roles.sort((a, b) => b.position - a.position).forEach(role => {
      console.log(`  - @${role.name} (ID: ${role.id}, Color: ${role.hexColor}, Position: ${role.position})`);
    });

    console.log(`\n========================================\n`);
  } catch (err) {
    console.error("[MAPPER] Error mapping guild:", err);
  } finally {
    client.destroy();
    process.exit(0);
  }
});

client.login(config.token);
