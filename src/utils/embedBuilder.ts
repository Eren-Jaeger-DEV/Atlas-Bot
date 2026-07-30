import { EmbedBuilder } from "discord.js";
import { config } from "../config.js";

export function createAtlasEmbed(title: string, description: string, color: number = config.colors.primary) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setTimestamp()
    .setFooter({
      text: "Atlas Studio • The Developer-First Independent IDE",
      iconURL: "https://raw.githubusercontent.com/Eren-Jaeger-DEV/Atlas/main/apps/editor/src/assets/logo.png"
    });
}
