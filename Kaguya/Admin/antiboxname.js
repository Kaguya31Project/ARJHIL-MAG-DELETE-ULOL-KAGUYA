class AntiBoxNameCommand {
  name = "antiboxname";
  author = "Arjhil Dacayanan";
  cooldowns = 60;
  description = "Prevent changing group names!";
  role = "admin";
  aliases = [];

  async execute({ event, Threads }) {
    try {
      var threads = (await Threads.find(event.threadID))?.data?.data;
      var status = threads?.anti?.nameBox ? false : true;
      await Threads.update(event.threadID, {
        anti: {
          nameBox: status,
        },
      });
      return kaguya.reply(`Anti group name change has been ${status ? "enabled" : "disabled"}!`);
    } catch (err) {
      console.error(err);
      return kaguya.reply("An unexpected error occurred!");
    }
  }
}

export default new AntiBoxNameCommand();
