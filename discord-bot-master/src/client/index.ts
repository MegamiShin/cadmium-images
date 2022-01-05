import { Client } from "discord.js";
import commands from "../commands";
import Handler from "./handler";

export default class client {
  token: string
  prefix: string
  handler: Handler
  discordClient: Client

  constructor(
    options: {
      token: string
      prefix: string
    }
  ) {
    this.prefix = options.prefix;
    this.token = options.token;
    this.handler = new Handler(this.prefix);

    this.discordClient = new Client({
      intents: [ "DIRECT_MESSAGES"],
      partials: [ "CHANNEL" ]
    });

    this.handler.addCommands(commands);
  };


  start() {
    this.discordClient.on("messageCreate", this.handler.handle);
    this.discordClient.login(this.token);
  }
}