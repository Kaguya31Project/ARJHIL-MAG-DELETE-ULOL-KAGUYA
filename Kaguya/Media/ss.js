import axios from "axios";
import fs from "fs";
import path from "path";

export default {
  name: "ss",
  author: "Kaguya Project",
  role: "member",
  description: "Capture a screenshot of a website using a provided URL.",
  execute: async ({ api, event, args }) => {
    const url = args[0];

    if (!url) {
      return api.sendMessage("⚠️ | Please provide a link to capture a screenshot.", event.threadID, event.messageID);
    }

    api.sendMessage("📸 | Capturing the screenshot, please wait...", event.threadID, event.messageID);

    try {
      const response = await axios.get(`https://nash-rest-api-production.up.railway.app/screenshot?url=${encodeURIComponent(url)}`);
      const data = response.data;

      if (!data.screenshotURL) {
        throw new Error("Failed to retrieve the screenshot URL.");
      }

      const imageUrl = data.screenshotURL;
      const imagePath = path.join(process.cwd(), "cache", "ss.png");

      const imageResponse = await axios({
        url: imageUrl,
        method: "GET",
        responseType: "stream"
      });

      imageResponse.data.pipe(fs.createWriteStream(imagePath)).on("finish", () => {
        api.sendMessage({
          attachment: fs.createReadStream(imagePath)
        }, event.threadID, () => {
          fs.unlinkSync(imagePath);
        });
      });
    } catch (error) {
      api.sendMessage(`⚠️ An error occurred: ${error.message}`, event.threadID, event.messageID);
    }
  }
};
