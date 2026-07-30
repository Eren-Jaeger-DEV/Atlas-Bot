import { GuildMember, TextChannel } from "discord.js";
import { config } from "../config.js";
import { createAtlasEmbed } from "../utils/embedBuilder.js";

export async function handleGuildMemberAdd(member: GuildMember) {
  const channelId = config.welcomeChannelId;
  if (!channelId) return;

  const channel = member.guild.channels.cache.get(channelId) as TextChannel;
  if (!channel) return;

  const welcomeEmbed = createAtlasEmbed(
    `👋 Welcome to Atlas Studio, ${member.displayName}!`,
    `We are thrilled to have you join our developer community!\n\n` +
    `**Quick Links:**\n` +
    `• 📜 Read the rules in <#rules-and-faq>\n` +
    `• 🚀 Check out Atlas Studio on [GitHub](${config.githubUrl})\n` +
    `• 💬 Chat with other devs in <#general>\n` +
    `• ❓ Need help? Ask in <#help-and-support>\n\n` +
    `Type \`/atlas info\` anytime to get started!`
  );

  await channel.send({ content: `Welcome ${member}!`, embeds: [welcomeEmbed] });
}
