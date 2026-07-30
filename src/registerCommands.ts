import { REST, Routes } from "discord.js";
import { config } from "./config.js";
import { data as atlasCommand } from "./commands/atlas.js";

const commands = [
  atlasCommand.toJSON()
];

const rest = new REST().setToken(config.token);

(async () => {
  try {
    console.log(`[INFO] Registering ${commands.length} application (/) commands...`);

    if (!config.token || !config.clientId) {
      console.error("[ERROR] DISCORD_TOKEN and CLIENT_ID must be set in .env!");
      process.exit(1);
    }

    if (config.guildId) {
      await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.guildId),
        { body: commands }
      );
      console.log(`[PASS] Successfully registered slash commands for server (${config.guildId})!`);
    } else {
      await rest.put(
        Routes.applicationCommands(config.clientId),
        { body: commands }
      );
      console.log(`[PASS] Successfully registered global slash commands!`);
    }
  } catch (error) {
    console.error("[FAIL] Error registering slash commands:", error);
  }
})();
