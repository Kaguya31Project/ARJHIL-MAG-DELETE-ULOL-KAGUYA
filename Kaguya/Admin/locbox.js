import sleep from "time-sleep";

class LocBox {
  constructor() {
    this.name = "locbox";
    this.author = "Arjhil Dacayanan";
    this.cooldowns = 60;
    this.description = "Filter groups below specified members!";
    this.role = "owner";
    this.aliases = [];
  }

  async execute({ api, event, Threads, args }) {
    try {
      const [length] = args.map(Number);

      if (isNaN(length) || length <= 0) {
        return kaguya.reply("Please enter a valid number!");
      }

      const threads = (await Threads.getAll()).data;
      const findThreads = threads.filter((thread) => thread.data.members < length);

      if (!findThreads.length) {
        return kaguya.reply(`No groups found with less than ${length} members!`);
      }

      for (const threadData of findThreads) {
        await api.removeUserFromGroup(api.getCurrentUserID(), threadData.threadID);
        await sleep(1000);
      }
    } catch (error) {
      console.error(error);
      return kaguya.reply("An unexpected error occurred!");
    }
  }
}

export default new LocBox();
