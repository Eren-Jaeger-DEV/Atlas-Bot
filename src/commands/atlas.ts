import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { CommandContext } from "../utils/CommandContext.js";
import { createAtlasEmbed } from "../utils/embedBuilder.js";
import { config } from "../config.js";

export const data = new SlashCommandBuilder()
  .setName("atlas")
  .setDescription("Atlas Studio IDE commands")
  .addSubcommand(sub =>
    sub.setName("info")
      .setDescription("Get information about Atlas Studio IDE")
  )
  .addSubcommand(sub =>
    sub.setName("docs")
      .setDescription("Search or get quick links to Atlas Studio documentation")
      .addStringOption(opt =>
        opt.setName("query")
          .setDescription("Topic to search (e.g. agents, plugins, keyboard)")
          .setRequired(false)
      )
  )
  .addSubcommand(sub =>
    sub.setName("doctor")
      .setDescription("Diagnose common setup and build issues for Atlas Studio")
  )
  .addSubcommand(sub =>
    sub.setName("release")
      .setDescription("View latest Atlas Studio release details and download links")
  )
  .addSubcommand(sub =>
    sub.setName("stats")
      .setDescription("View repository statistics and health metrics")
  );

export async function execute(ctx: CommandContext) {
  const subcommand = ctx.getSubcommand() || "info";

  if (subcommand === "info") {
    const embed = createAtlasEmbed(
      "🚀 Atlas Studio IDE — v1.0.0 General Availability",
      "**Atlas Studio** is a developer-first independent IDE platform built with Electron, Vite, TypeScript, and a multi-agent AI orchestration architecture.\n\n" +
      "**Key Features:**\n" +
      "• 🧠 **Parallel Agent Orchestrator**: Concurrent multi-agent execution & routing\n" +
      "• ⚡ **Atlascord Presence Engine**: 100% real-time custom Discord Rich Presence\n" +
      "• 🧩 **Atlas Forge Plugin System**: Sandboxed CommonJS/ESM plugin ecosystem\n" +
      "• 🔍 **AST Knowledge Graph**: SQLite symbol indexing & code health metrics\n" +
      "• 🎨 **Stealth Dark Theme**: Obsidian slate visual design system\n\n" +
      "[GitHub Repository](https://github.com/Eren-Jaeger-DEV/Atlas) • [Documentation](https://github.com/Eren-Jaeger-DEV/Atlas#readme)"
    );

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setLabel("GitHub Repository").setStyle(ButtonStyle.Link).setURL(config.githubUrl),
      new ButtonBuilder().setLabel("Download v1.0.0").setStyle(ButtonStyle.Link).setURL(`${config.githubUrl}/releases`)
    );

    await ctx.reply({ embeds: [embed], components: [buttons] });
  } else if (subcommand === "docs") {
    const query = ctx.getString("query")?.toLowerCase();

    let text = "**Atlas Studio Documentation Hub**\n\n";
    if (query?.includes("agent") || query?.includes("ai")) {
      text += "**AI Multi-Agent System:**\n" +
        "Atlas uses a multi-provider router supporting Google Gemini, OpenAI, Anthropic, and local Ollama models. " +
        "Agents execute in parallel with real-time progress callbacks and automated diff previews.\n\n";
    } else if (query?.includes("plugin") || query?.includes("forge") || query?.includes("extension")) {
      text += "**Atlas Forge Plugin System:**\n" +
        "Atlas Forge enables first-party and community plugins sandboxed inside VM containers. " +
        "Includes TypeScript (`atlas-lang-typescript`), Python (`atlas-lang-python`), and Markdown (`atlas-viewer-markdown`).\n\n";
    } else {
      text += "Explore the complete Atlas architecture docs:\n" +
        "• [Architecture Overview](https://github.com/Eren-Jaeger-DEV/Atlas/blob/main/docs/architecture/RFC-014-cloud-sync-accounts-and-team-collaboration.md)\n" +
        "• [Getting Started & Installation](https://github.com/Eren-Jaeger-DEV/Atlas#getting-started)\n" +
        "• [Monorepo Package Structure](https://github.com/Eren-Jaeger-DEV/Atlas#repository-structure)\n\n";
    }

    const embed = createAtlasEmbed("📖 Atlas Studio Docs", text);
    await ctx.reply({ embeds: [embed] });
  } else if (subcommand === "doctor") {
    const embed = createAtlasEmbed(
      "🩺 Atlas Doctor — Troubleshooter",
      "**Common Setup Checklist:**\n\n" +
      "1️⃣ **Node Version**: Node.js `v20.x` or higher required (`node -v`)\n" +
      "2️⃣ **pnpm**: pnpm `v9.x` required (`pnpm -v`)\n" +
      "3️⃣ **Port Bindings**: Dev server uses port `5173`. Clear port locks with `killall node` if Vite fails to start.\n" +
      "4️⃣ **TypeScript Build**: Build core packages first using `pnpm --filter \"@atlas/core\" --filter \"@atlas/agents\" build`.\n\n" +
      "Need more help? Ask in <#help-and-support> or open a GitHub issue!"
    );
    await ctx.reply({ embeds: [embed] });
  } else if (subcommand === "release") {
    const embed = createAtlasEmbed(
      "📦 Atlas Studio v1.0.0 Release",
      "**Version:** v1.0.0 GA\n" +
      "**Status:** Production Ready\n\n" +
      "**Highlights:**\n" +
      "• Atlas Forge Plugin System & ecosystem marketplace\n" +
      "• 25+ language icon mappings for Discord Rich Presence\n" +
      "• Optimized multi-agent execution pipeline\n" +
      "• Standalone source zip archive (`Atlas-Studio-Source.zip`)\n\n" +
      "[View Release Notes & Download Assets](https://github.com/Eren-Jaeger-DEV/Atlas/releases)"
    );
    await ctx.reply({ embeds: [embed] });
  } else if (subcommand === "stats") {
    const embed = createAtlasEmbed(
      "📊 Atlas Studio Repository Health",
      "**Repository Info:**\n" +
      "• **Owner:** Eren-Jaeger-DEV\n" +
      "• **Monorepo Packages:** `@atlas/core`, `@atlas/sdk`, `@atlas/agents`, `@atlas/graph`, `@atlas/parser`, `@atlas/editor`, `@atlas/cli`\n" +
      "• **License:** MIT License\n" +
      "• **Architecture:** Local-First Hybrid Agentic Engine\n\n" +
      `[Explore Source Code](${config.githubUrl})`
    );
    await ctx.reply({ embeds: [embed] });
  } else {
    await ctx.reply({ content: `Unknown subcommand \`${subcommand}\`. Try \`A!atlas info\` or \`A!atlas docs\`.` });
  }
}
