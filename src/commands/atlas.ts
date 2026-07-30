import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } from "discord.js";
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
  )
  .addSubcommand(sub =>
    sub.setName("setup")
      .setDescription("Initialize server channel embeds (#rules, #about-us) [Admin Only]")
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
      "Need more help? Ask in <#1531390768130953286> or open a GitHub issue!"
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
  } else if (subcommand === "setup") {
    if (!ctx.guild) {
      await ctx.reply({ content: "This command can only be executed within the Atlas Studio Discord Server." });
      return;
    }

    await ctx.deferReply(true);

    try {
      // Setup #rules channel
      const rulesChannel = ctx.guild.channels.cache.get(config.channels.rules);
      if (rulesChannel && rulesChannel.isTextBased()) {
        const rulesEmbed = createAtlasEmbed(
          "📜 Atlas Studio Community Rules & Guidelines",
          "Welcome to the official **Atlas Studio** Discord server! Please adhere to our community guidelines to keep discussions constructive and welcoming.\n\n" +
          "1️⃣ **Be Respectful & Professional**: No harassment, hate speech, or toxic behavior.\n" +
          "2️⃣ **Keep Channels Focused**: Use designated channels (<#1531386185434267749> for chat, <#1531390768130953286> for help, <#1531390649696260298> for bugs).\n" +
          "3️⃣ **No Spam or Unauthorized Ads**: Self-promotion belongs in <#1531394730137620591> for verified plugins.\n" +
          "4️⃣ **Security & Privacy**: Never post API keys, secret tokens, or personal credentials in chat.\n" +
          "5️⃣ **Bot Commands**: Use <#1531400738058539209> when running `A!` prefix or `/atlas` commands."
        );
        await rulesChannel.send({ embeds: [rulesEmbed] });
      }

      // Setup #about-us channel
      const aboutChannel = ctx.guild.channels.cache.get(config.channels.aboutUs);
      if (aboutChannel && aboutChannel.isTextBased()) {
        const aboutEmbed = createAtlasEmbed(
          "🌐 About Atlas Studio",
          "**Atlas Studio** is a high-performance independent desktop IDE engineered for complex software architecture.\n\n" +
          "**Core Design System:**\n" +
          "• **Local-First**: 100% offline-ready core with zero vendor lock-in.\n" +
          "• **Multi-Agent Orchestrator**: Concurrent sub-agent task breakdown and self-healing error repair.\n" +
          "• **Atlas Forge**: Plugin ecosystem supporting sandboxed CJS/ESM modules.\n" +
          "• **Atlascord**: Real-time Discord Rich Presence extension.\n\n" +
          `[GitHub Repository](${config.githubUrl}) • [Releases](${config.githubUrl}/releases)`
        );
        await aboutChannel.send({ embeds: [aboutEmbed] });
      }

      await ctx.reply({ content: "Successfully populated `#rules` and `#about-us` channels!" });
    } catch (err: any) {
      await ctx.reply({ content: `Failed to populate channels: ${err.message}` });
    }
  } else {
    await ctx.reply({ content: `Unknown subcommand \`${subcommand}\`. Try \`A!atlas info\` or \`A!atlas docs\`.` });
  }
}
