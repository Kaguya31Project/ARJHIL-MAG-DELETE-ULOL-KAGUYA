class KickCommand {
  name = "kick";
  author = "Arjhil Dacayanan";
  cooldowns = 60;
  description = "Kick users out of the group!";
  role = "admin";
  aliases = [""];

  async execute({ api, event, Threads }) {
    try {
      const mentions = Object.keys(event.mentions);
      const threadData = (await Threads.find(event.threadID))?.data?.data;

      if (!threadData.adminIDs.includes(api.getCurrentUserID())) {
        return kaguya.reply("The bot does not have admin privileges in the group, so it cannot kick users.");
      }

      if (!mentions[0]) {
        return kaguya.reply("You need to tag the user(s) you want to kick!");
      }

      await Promise.all(
        mentions.map(async (id) => {
          try {
            await api.removeUserFromGroup(id, event.threadID);
          } catch (err) {
            console.error(err);
          }
        })
      );
    } catch (err) {
      console.error(err);
      return kaguya.reply("An unexpected error occurred!");
    }
  }
}

export default new KickCommand();
