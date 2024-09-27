class OutCommand {
  name = "out";
  version = "1.0.0";
  author = "Arjhil Dacayanan";
  cooldowns = 10;
  description = "Leave the group";
  role = "admin";
  aliases = [];
  usePrefix = true;

  async execute({ api, event, args }) {
    try {
      if (!args[0]) {
        await api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
        return api.sendMessage("Bot has left the group.", event.threadID);
      }

      if (!isNaN(args[0])) {
        await api.removeUserFromGroup(api.getCurrentUserID(), args[0]);
        return api.sendMessage("Bot has left the specified group.", event.threadID);
      }

      return api.sendMessage("Invalid group ID provided. Please provide a valid group ID or leave the current group.", event.threadID);
    } catch (error) {
      console.error("Error in out command:", error);
      return api.sendMessage("An error occurred while attempting to leave the group.", event.threadID);
    }
  }
}

export default new OutCommand();
