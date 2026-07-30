import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";
import { CommandContext } from "../utils/CommandContext.js";
import { createAtlasEmbed } from "../utils/embedBuilder.js";

const ROLE_DEFINITIONS = [
  { id: "role_ts", label: "TypeScript Dev", emoji: "🟦", color: 0x3178c6 },
  { id: "role_python", label: "Python Dev", emoji: "🟨", color: 0xf7c844 },
  { id: "role_rust", label: "Rust Dev", emoji: "🟧", color: 0xdea584 },
  { id: "role_cpp", label: "C++ Dev", emoji: "🟥", color: 0xf34b7d },
  { id: "role_ai", label: "AI / ML Engineer", emoji: "🟪", color: 0xa855f7 },
  { id: "role_tester", label: "Atlas Beta Tester", emoji: "⚡", color: 0x38bdf8 }
];

export async function executeRolesCommand(ctx: CommandContext) {
  if (!ctx.guild) {
    await ctx.reply({ content: "This command can only be used inside the Atlas Studio server." });
    return;
  }

  const embed = createAtlasEmbed(
    "🎭 Atlas Tech Stack & Community Roles",
    "Click the buttons below to assign or remove roles from your profile!\n\n" +
    "• 🟦 **TypeScript Dev**\n" +
    "• 🟨 **Python Dev**\n" +
    "• 🟧 **Rust Dev**\n" +
    "• 🟥 **C++ Dev**\n" +
    "• 🟪 **AI / ML Engineer**\n" +
    "• ⚡ **Atlas Beta Tester**"
  );

  const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId("role_ts").setLabel("TypeScript").setEmoji("🟦").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("role_python").setLabel("Python").setEmoji("🟨").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("role_rust").setLabel("Rust").setEmoji("🟧").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("role_cpp").setLabel("C++").setEmoji("🟥").setStyle(ButtonStyle.Danger)
  );

  const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId("role_ai").setLabel("AI Engineer").setEmoji("🟪").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("role_tester").setLabel("Beta Tester").setEmoji("⚡").setStyle(ButtonStyle.Success)
  );

  await ctx.reply({ embeds: [embed], components: [row1, row2] });
}

export async function handleRoleButton(interaction: any) {
  if (!interaction.isButton() || !interaction.guild) return;

  const roleDef = ROLE_DEFINITIONS.find(r => r.id === interaction.customId);
  if (!roleDef) return;

  await interaction.deferReply({ ephemeral: true });

  try {
    // Find or create role
    let role = interaction.guild.roles.cache.find((r: any) => r.name === roleDef.label);
    if (!role) {
      role = await interaction.guild.roles.create({
        name: roleDef.label,
        color: roleDef.color,
        reason: "Atlas Bot Self-Assignable Tech Role"
      });
    }

    const member = await interaction.guild.members.fetch(interaction.user.id);
    if (member.roles.cache.has(role.id)) {
      await member.roles.remove(role);
      await interaction.followUp({ content: `Removed **${roleDef.label}** role from your profile.`, ephemeral: true });
    } else {
      await member.roles.add(role);
      await interaction.followUp({ content: `Added **${roleDef.label}** role to your profile!`, ephemeral: true });
    }
  } catch (err: any) {
    console.error("[ERROR] Role toggle failed:", err);
    await interaction.followUp({ content: `Failed to update role: ${err.message}`, ephemeral: true });
  }
}
