class ThreadsCommand {
  constructor() {
    this.name = "threads";
    this.author = "Arjhil Dacayanan";
    this.cooldowns = 0;
    this.description = "Ban groups from using the bot";
    this.role = "owner";
    this.aliases = ["thread"];
  }

  async execute({ api, event, Users, args, Threads }) {
    if (!event.isGroup) return kaguya.reply("This command can only be used in groups");
    var [type, reason = "No reason provided"] = args;
    switch (type) {
      case "list": {
        var { data } = await Threads.getAll();
        var msgArray = data.map((value, index) => {
          return `${index + 1}. TID: ${value.threadID} - Number of members: ${value.data.members}\nGroup name: ${value.data.name}\n`;
        });
        var msg = msgArray.join("\n");
        return kaguya.reply(`${msg}\nReply to this message with the number of the group to ban it!`, (err, info) => {
          client.handler.reply.set(info.messageID, {
            author: event.senderID,
            name: this.name,
            autosend: true,
            type: "ban",
            threadDATA: data,
          });
        });
      }
      case "ban": {
        var TID = await Threads.ban(event.threadID, { status: true, reason });
        return kaguya.reply(TID.data);
      }
      case "unban": {
        var TID = await Threads.ban(event.threadID, { status: false, reason: "" });
        console.log(TID);
        return kaguya.reply(`Successfully unbanned group with TID: ${event.threadID}`);
      }
      default: {
        var name = client.config.prefix + this.name;
        return kaguya.reply(`[ THREADS ]\n${name} ban <Use to ban a group>\n${name} unban <Use to unban a group>\n${name} list <Use to view the list of groups>`);
      }
    }
  }
}

export default new ThreadsCommand();
