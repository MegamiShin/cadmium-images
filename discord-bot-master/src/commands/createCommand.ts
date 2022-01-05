import Command from "../client/command";
import rpc from "../rpc";

const command = new Command({
  name: "create"
});

command.setCallback(async (message, args) => {
  const user = await rpc.call("core.users.create", { code: args[0], discordId: message.author.id });
  if (!user!.success) return message.channel.send(user!.error as any);

  message.channel.send("registered");
});

export default command;