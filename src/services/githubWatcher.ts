import { Client, TextChannel } from "discord.js";
import { config } from "../config.js";
import { createAtlasEmbed } from "../utils/embedBuilder.js";

let lastSeenSha: string | null = null;
let lastSeenReleaseId: number | null = null;
let isInitialized = false;

interface GitHubCommit {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  author?: {
    login: string;
    avatar_url: string;
  };
}

interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  html_url: string;
  published_at: string;
}

export function startGitHubWatcher(client: Client, intervalMs = 60_000) {
  console.log("[PASS] Starting GitHub Live Commit & Release Watcher...");

  // Run initial check to set baseline
  checkGitHubUpdates(client);

  // Poll every intervalMs (60s)
  setInterval(() => {
    checkGitHubUpdates(client);
  }, intervalMs);
}

async function checkGitHubUpdates(client: Client) {
  try {
    await Promise.all([
      checkCommits(client),
      checkReleases(client)
    ]);
    isInitialized = true;
  } catch (err: any) {
    console.error("[ERROR] GitHub Watcher poll failed:", err.message);
  }
}

async function checkCommits(client: Client) {
  const repo = "Eren-Jaeger-DEV/Atlas";
  const url = `https://api.github.com/repos/${repo}/commits?per_page=5`;

  const headers: Record<string, string> = {
    "User-Agent": "Atlas-Discord-Bot",
    "Accept": "application/vnd.github.v3+json"
  };

  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) return;

  const commits = (await res.json()) as GitHubCommit[];
  if (!commits || commits.length === 0) return;

  const latestSha = commits[0].sha;

  if (!lastSeenSha) {
    lastSeenSha = latestSha;
    console.log(`[PASS] GitHub Watcher baseline set to commit ${latestSha.substring(0, 7)}`);
    return;
  }

  if (latestSha !== lastSeenSha && isInitialized) {
    // Find all new commits up to lastSeenSha
    const newCommits: GitHubCommit[] = [];
    for (const commit of commits) {
      if (commit.sha === lastSeenSha) break;
      newCommits.push(commit);
    }

    lastSeenSha = latestSha;

    if (newCommits.length > 0) {
      // Send updates to #github-feed channel
      const channel = client.channels.cache.get(config.channels.githubFeed) as TextChannel;
      if (!channel) return;

      for (const commit of newCommits.reverse()) {
        const shortSha = commit.sha.substring(0, 7);
        const authorName = commit.author?.login || commit.commit.author.name;
        const commitMsg = commit.commit.message.split("\n")[0]; // First line

        const embed = createAtlasEmbed(
          `[COMMIT] New Commit on Atlas Studio (main)`,
          `**Commit:** [\`${shortSha}\`](${commit.html_url})\n` +
          `**Author:** [${authorName}](https://github.com/${authorName})\n` +
          `**Message:** ${commitMsg}\n\n` +
          `[View Commit Diff](${commit.html_url})`
        );

        if (commit.author?.avatar_url) {
          embed.setThumbnail(commit.author.avatar_url);
        }

        await channel.send({ embeds: [embed] });
      }
    }
  }
}

async function checkReleases(client: Client) {
  const repo = "Eren-Jaeger-DEV/Atlas";
  const url = `https://api.github.com/repos/${repo}/releases?per_page=1`;

  const headers: Record<string, string> = {
    "User-Agent": "Atlas-Discord-Bot",
    "Accept": "application/vnd.github.v3+json"
  };

  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) return;

  const releases = (await res.json()) as GitHubRelease[];
  if (!releases || releases.length === 0) return;

  const latestRelease = releases[0];

  if (!lastSeenReleaseId) {
    lastSeenReleaseId = latestRelease.id;
    console.log(`[PASS] GitHub Watcher baseline release set to ${latestRelease.tag_name}`);
    return;
  }

  if (latestRelease.id !== lastSeenReleaseId && isInitialized) {
    lastSeenReleaseId = latestRelease.id;

    // Send release notice to #changelog and #announcements
    const changelogChannel = client.channels.cache.get(config.channels.changelog) as TextChannel;
    const announceChannel = client.channels.cache.get(config.channels.announcements) as TextChannel;

    let bodyText = latestRelease.body || "No changelog details provided.";
    if (bodyText.length > 1200) {
      bodyText = bodyText.substring(0, 1200) + "\n...[Truncated]";
    }

    const releaseUrl = latestRelease.html_url;

    const embed = createAtlasEmbed(
      `[RELEASE] Atlas Studio ${latestRelease.name || latestRelease.tag_name} Published!`,
      `**Version Tag:** \`${latestRelease.tag_name}\`\n\n` +
      `**[DOWNLOAD INSTALLERS & BINARIES]**\n` +
      `• **Windows 10/11 (.exe)**: [Download Installer](${releaseUrl})\n` +
      `• **Linux (.deb)**: [Download Package](${releaseUrl})\n` +
      `• **Linux (.AppImage)**: [Download Universal AppImage](${releaseUrl})\n` +
      `• **macOS (.dmg)**: [Download Apple Package](${releaseUrl})\n\n` +
      `**[RELEASE HIGHLIGHTS & CHANGELOG]**\n` +
      `${bodyText}\n\n` +
      `**[QUICKSTART & USE CASES]**\n` +
      `• **High-Speed IDE Core**: Zero-AI editor core with instant boot (<10ms paint).\n` +
      `• **AI Assistant Integration**: Powered by Google Antigravity & AI Agent runtime.\n` +
      `• **Plugin Ecosystem**: Native Atlas Forge extensions & Monaco LSP isolation.\n\n` +
      `**[COMMUNITY & SUPPORT CHANNELS]**\n` +
      `• **Report Bugs & Issues**: <#${config.channels.bugReport}>\n` +
      `• **Get Help & Support**: <#${config.channels.help}>\n` +
      `• **Share Feedback & Chat**: <#${config.channels.general}>\n` +
      `• **Plugin Showcase**: <#${config.channels.pluginShowcase}>\n\n` +
      `[View Official GitHub Release & Source Code](${releaseUrl})`
    );

    if (changelogChannel) await changelogChannel.send({ content: `@everyone New Atlas Studio release is live! Download links below:`, embeds: [embed] });
    if (announceChannel) await announceChannel.send({ embeds: [embed] });
  }
}

export async function fetchRecentCommits(limit = 5): Promise<GitHubCommit[]> {
  const repo = "Eren-Jaeger-DEV/Atlas";
  const url = `https://api.github.com/repos/${repo}/commits?per_page=${limit}`;

  const headers: Record<string, string> = {
    "User-Agent": "Atlas-Discord-Bot",
    "Accept": "application/vnd.github.v3+json"
  };

  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`GitHub API HTTP ${res.status}: ${res.statusText}`);
  return (await res.json()) as GitHubCommit[];
}
