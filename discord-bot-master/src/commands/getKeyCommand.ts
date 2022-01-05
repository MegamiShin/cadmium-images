import Command from "../client/command";
import rpc from "../rpc";

const command = new Command({
  name: "get-key"
});

command.setCallback(async (message, args) => {
  const user = await rpc.call("core.users.discord.get", { id: message.author.id! });
  if (user!.error) return message.channel.send(user!.error as any);

  message.channel.send(user!.accessKey as string);
});

export default command;