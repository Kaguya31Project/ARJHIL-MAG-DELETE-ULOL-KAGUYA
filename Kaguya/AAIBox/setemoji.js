import fs from "fs";

const emojiJSON = JSON.parse(fs.readFileSync("./cache/emoji/emoji.json", "utf-8"));

class SetEmojiCommand {
  name = "setemoji";
  author = "Arjhil Dacayanan";
  cooldowns = 60;
  description = "Change group icon";
  role = "admin";
  aliases = [];

  async execute({ api, event, args }) {
    try {
      var [emoji] = args;
      if (!emojiJSON.includes(emoji)) {
        return kaguya.reply("Please enter a valid emoji!");
      }
      await api.changeThreadEmoji(emoji, event.threadID, event.messageID);
    } catch (err) {
      console.error(err);
    }
  }
}

export default new SetEmojiCommand();
