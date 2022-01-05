import Command from "../client/command";
import rpc from "../rpc";

const command = new Command({
  name: "generate-invite"
});

command.setCallback(async (message) => {
  const res = await rpc.call("core.invites.create", {

  });

  message.channel.send(res!.invite as any);
});

export default command;