import axios from "axios";
import fs from "fs";

const emojiJSON = JSON.parse(fs.readFileSync("./cache/emoji/emoji.json", "utf-8"));

export default {
  name: "emojimix",
  author: "Arjhil Dacayanan",
  role: "member",
  cooldowns: 10,
  description: "Create an image from 2 emojis you choose.",

  async execute({ api, args, event }) {
    const [emoji_1, emoji_2] = args;

    if (!emoji_1 || !emoji_2) {
      return api.sendMessage("Please enter the correct format!\nExample: !emojimix 😎 😇 ", event.threadID);
    }

    if (!emojiJSON.includes(emoji_1) || !emojiJSON.includes(emoji_2)) {
      return api.sendMessage("The emojis you entered are not valid!", event.threadID);
    }

    try {
      const mix = await axios.get(encodeURI(`https://tenor.googleapis.com/v2/featured?key=YOUR_API_KEY&client_key=emoji_kitchen_funbox&q=${emoji_1}_${emoji_2}&collection=emoji_kitchen_v6&contentfilter=high`));

      if (!mix.data.results.length) {
        return api.sendMessage("Cannot mix these emojis, please try with different emojis!", event.threadID);
      }

      const { png_transparent: { url } } = mix.data.results[0].media_formats;
      const getImg = await axios.get(url, { responseType: "stream" });

      return api.sendMessage({
        body: `Result of icons: ${emoji_1} and ${emoji_2}:`,
        attachment: getImg.data
      }, event.threadID, event.messageID);
    } catch (error) {
      console.error("An error occurred: ", error);
      return api.sendMessage("There was an error processing your request. Please try again later.", event.threadID);
    }
  },
};
