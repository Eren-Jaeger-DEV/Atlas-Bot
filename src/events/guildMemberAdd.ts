import { GuildMember, TextChannel } from "discord.js";
import { config } from "../config.js";
import { createAtlasEmbed } from "../utils/embedBuilder.js";

export async function handleGuildMemberAdd(member: GuildMember) {
  const channelId = config.channels.welcome;
  if (!channelId) return;

  const channel = member.guild.channels.cache.get(channelId) as TextChannel;
  if (!channel) return;

  const welcomeEmbed = createAtlasEmbed(
    `👋 Welcome to Atlas Studio, ${member.displayName}!`,
    `We are thrilled to have you join our developer community!\n\n` +
    `**Quick Navigation:**\n` +
    `• 📜 Read server rules in <#${config.channels.rules}>\n` +
    `• 💡 Learn about our IDE in <#${config.channels.aboutUs}>\n` +
    `• 💬 Introduce yourself & chat in <#${config.channels.general}>\n` +
    `• ❓ Need technical support? Ask in <#${config.channels.help}>\n` +
    `• 🤖 Run bot commands in <#${config.channels.botCommands}>\n\n` +
    `Type \`A!help\` or \`/atlas info\` anytime to get started!`
  );

  await channel.send({ content: `Welcome ${member}!`, embeds: [welcomeEmbed] });
}
