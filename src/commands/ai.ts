import { CommandContext } from "../utils/CommandContext.js";
import { createAtlasEmbed } from "../utils/embedBuilder.js";

export async function executeAiCommand(ctx: CommandContext) {
  const prompt = ctx.getString("prompt") || ctx.args.join(" ");

  if (!prompt) {
    await ctx.reply({ content: "Please provide a question or prompt! Example: `A!ask How do I write a plugin for Atlas Studio?`" });
    return;
  }

  await ctx.deferReply();

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    let replyText = "";
    if (apiKey) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `You are Atlas AI, the intelligent assistant for Atlas Studio IDE (a high-performance local-first desktop IDE). Answer the developer's question concisely:\n\nQuestion: ${prompt}`
                  }
                ]
              }
            ]
          })
        }
      );

      if (response.ok) {
        const data: any = await response.json();
        replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response text generated.";
      } else {
        replyText = `API error (${response.status}): ${response.statusText}`;
      }
    } else {
      replyText = "💡 **Atlas AI Helper:**\n" +
        "To enable live Gemini AI answers inside Discord, add `GEMINI_API_KEY=your_key` to `.env` on the bot host!\n\n" +
        "**Quick FAQ:**\n" +
        "• Atlas Studio SDK: `@atlas/sdk` provides `AtlasSDK.definePlugin` and `PluginContext`.\n" +
        "• Monorepo structure: `apps/editor`, `packages/core`, `packages/sdk`, `packages/agents`.\n" +
        "• Documentation: See <#1531389764522086473> or run `A!docs`.";
    }

    // Limit Discord embed length
    if (replyText.length > 3900) {
      replyText = replyText.substring(0, 3900) + "\n...[Truncated]";
    }

    const embed = createAtlasEmbed(`🤖 Atlas AI Assistant`, `**Prompt:** *${prompt}*\n\n${replyText}`);
    await ctx.reply({ embeds: [embed] });
  } catch (err: any) {
    console.error("[ERROR] AI command failed:", err);
    await ctx.reply({ content: `Failed to generate AI response: ${err.message}` });
  }
}
