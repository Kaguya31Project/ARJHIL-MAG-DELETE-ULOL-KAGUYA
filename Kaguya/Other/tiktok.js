import axios from "axios";
import fs from "fs-extra";

export default {
  name: "tiktok",
  author: "Arjhil Dacayanan",
  cooldowns: 60,
  description: "Download TikTok videos!",
  role: "member",
  aliases: ["tik"],
  execute: async ({ api, args, event }) => {
    var [url] = args;
    try {
      var { data } = await axios.get(`https://api.nvhdevz.repl.co/tiktok?url=${url}`);
      switch (true) {
        case "data" in data: {
          var { title, play } = data.data;
          var bufferVideo = await axios.get(play, { responseType: "arraybuffer" });
          var path = `./cache/tiktok_${event.senderID}.mp4`;
          fs.writeFileSync(path, Buffer.from(bufferVideo.data));
          api.sendMessage(
            {
              body: title,
              attachment: fs.createReadStream(path),
            },
            event.threadID,
            (err) => {
              if (err) return;
              fs.unlinkSync(path);
            },
            event.messageID
          );
        }
        break;
        default: {
          return kaguya.reply(data.msg);
        }
      }
    } catch (err) {
      console.log(err);
      return kaguya.reply("An error occurred!");
    }
  },
};
