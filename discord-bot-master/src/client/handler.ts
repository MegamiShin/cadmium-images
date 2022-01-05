import { Collection } from "@discordjs/collection";
import { Message } from "discord.js";
import Command from "./command";

export default class handler {
  commands: Collection<string, Command>;
  prefix: string;

  constructor(prefix: string) {
    this.commands = new Collection();
    this.handle = this.handle.bind(this);

    this.prefix = prefix;
  };

  addCommands(commandsArr: Command[]) {
    const { commands } = this;

    commandsArr.forEach(command => commands.set(command.name, command)); // for optimization
  };

  async handle(message: Message) {
    if (message.author.bot) return;
    const { prefix } = this;

    const { commands } = this;
    const [ command_Name, ...command_Args ] = message.content.split(" ");
    
    if (command_Name.substr(0, prefix.length) !== prefix) return;
    const command = commands.get(command_Name.substr(prefix.length));

    if (!command || !command.callback) return;
    
    command.callback(message, command_Args);
  }
}