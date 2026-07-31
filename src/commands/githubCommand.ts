import { CommandContext } from "../utils/CommandContext.js";
import { createAtlasEmbed } from "../utils/embedBuilder.js";
import { fetchRecentCommits } from "../services/githubWatcher.js";

export async function executeGithubCommand(ctx: CommandContext) {
  await ctx.deferReply();

  try {
    const commits = await fetchRecentCommits(5);
    if (!commits || commits.length === 0) {
      await ctx.reply({ content: "No recent commits found on GitHub." });
      return;
    }

    let description = "**Latest Commits on `Eren-Jaeger-DEV/Atlas` (main branch):**\n\n";

    for (const item of commits) {
      const shortSha = item.sha.substring(0, 7);
      const author = item.author?.login || item.commit.author.name;
      const msg = item.commit.message.split("\n")[0];
      description += `• [\`${shortSha}\`](${item.html_url}) **${msg}** — *${author}*\n`;
    }

    description += `\n[View Full Commit History on GitHub](https://github.com/Eren-Jaeger-DEV/Atlas/commits/main)`;

    const embed = createAtlasEmbed("🐙 Atlas Studio — Recent GitHub Commits", description);
    await ctx.reply({ embeds: [embed] });
  } catch (err: any) {
    console.error("[ERROR] A!github command failed:", err);
    await ctx.reply({ content: `Failed to fetch GitHub commits: ${err.message}` });
  }
}
