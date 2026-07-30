import {
  ChatInputCommandInteraction,
  Message,
  Guild,
  TextBasedChannel,
  User,
  GuildMember,
  APIInteractionGuildMember,
  EmbedBuilder,
  ActionRowBuilder,
  MessageReplyOptions,
  InteractionReplyOptions
} from "discord.js";

export class CommandContext {
  public interaction?: ChatInputCommandInteraction;
  public message?: Message;
  public args: string[];
  public guild: Guild | null;
  public channel: TextBasedChannel | null;
  public user: User;
  public member: GuildMember | APIInteractionGuildMember | null;
  private isDeferred = false;

  constructor(options: { interaction?: ChatInputCommandInteraction; message?: Message; args?: string[] }) {
    this.interaction = options.interaction;
    this.message = options.message;
    this.args = options.args || [];

    if (this.interaction) {
      this.guild = this.interaction.guild;
      this.channel = this.interaction.channel;
      this.user = this.interaction.user;
      this.member = this.interaction.member;
    } else if (this.message) {
      this.guild = this.message.guild;
      this.channel = this.message.channel;
      this.user = this.message.author;
      this.member = this.message.member;
    } else {
      throw new Error("CommandContext requires either an interaction or a message.");
    }
  }

  public get isSlash(): boolean {
    return !!this.interaction;
  }

  public async deferReply(ephemeral = false): Promise<void> {
    this.isDeferred = true;
    if (this.interaction) {
      await this.interaction.deferReply({ ephemeral });
    } else if (this.channel && "sendTyping" in this.channel) {
      await (this.channel as any).sendTyping();
    }
  }

  public async reply(options: {
    content?: string;
    embeds?: EmbedBuilder[];
    components?: any[];
    ephemeral?: boolean;
  }): Promise<any> {
    if (this.interaction) {
      if (this.interaction.replied || this.interaction.deferred) {
        return await this.interaction.followUp({
          content: options.content,
          embeds: options.embeds,
          components: options.components,
          ephemeral: options.ephemeral
        } as InteractionReplyOptions);
      } else {
        return await this.interaction.reply({
          content: options.content,
          embeds: options.embeds,
          components: options.components,
          ephemeral: options.ephemeral
        } as InteractionReplyOptions);
      }
    } else if (this.message) {
      return await this.message.reply({
        content: options.content,
        embeds: options.embeds,
        components: options.components
      } as MessageReplyOptions);
    }
  }

  public getSubcommand(): string | null {
    if (this.interaction) {
      try {
        return this.interaction.options.getSubcommand(false);
      } catch {
        return null;
      }
    } else {
      return this.args[0]?.toLowerCase() || null;
    }
  }

  public getString(name: string): string | null {
    if (this.interaction) {
      return this.interaction.options.getString(name);
    } else {
      // Check if named option like query:something or key=value is passed in args
      const prefixMatch = this.args.find(arg => arg.toLowerCase().startsWith(`${name}:`) || arg.toLowerCase().startsWith(`${name}=`));
      if (prefixMatch) {
        return prefixMatch.substring(name.length + 1);
      }
      // If asking for query and args has extra positionals (e.g. A!atlas docs agents)
      if (name === "query" && this.args.length > 1) {
        return this.args.slice(1).join(" ");
      }
      return null;
    }
  }
}
