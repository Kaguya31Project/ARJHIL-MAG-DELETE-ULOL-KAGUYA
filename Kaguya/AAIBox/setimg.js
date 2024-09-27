import axios from "axios";
import fs from "fs";

class SetImageCommand {
  name = "setimg";
  author = "Arjhil Dacayanan";
  cooldowns = 60;
  description = "Change group avatar";
  role = "admin";
  aliases = [""];

  async execute({ api, event }) {
    try {
      if (event.type !== "message_reply") return api.sendMessage("❌ You have to reply to an image", event.threadID);
      if (event.messageReply.attachments.length !== 1) return api.sendMessage("❌ Please reply with only one image!", event.threadID);

      var avatar = (await axios.get(event.messageReply.attachments[0].url, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(`./cache/${event.senderID}_${event.threadID}.png`, Buffer.from(avatar));
      return api.changeGroupImage(fs.createReadStream(`./cache/${event.senderID}_${event.threadID}.png`), event.threadID, () => {
        fs.unlinkSync(`./cache/${event.senderID}_${event.threadID}.png`);
      });
    } catch (err) {
      console.error(err);
    }
  }
}

export default new SetImageCommand();
