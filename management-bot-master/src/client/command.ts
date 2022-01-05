import { Message, TextBasedChannelTypes } from "discord.js";

export default class Command { 
  name: string
  callback?: (message: Message, args: string[]) => any
  channels?: TextBasedChannelTypes[]

  constructor(
    options: {
      name: string
    }
  ) {
    this.name = options.name;
  }

  setCallback(callback: (message: Message, args: string[]) => any) {
    this.callback = callback;
  }
}