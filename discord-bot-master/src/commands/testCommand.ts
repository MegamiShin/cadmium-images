import Command from "../client/command";

const command = new Command({
  name: "test"
});

command.setCallback((message, args) => {
  message.reply("fart");
});

export default command;