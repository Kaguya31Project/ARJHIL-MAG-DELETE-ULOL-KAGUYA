import axios from "axios";
import path from "path";
import fs from "fs-extra";

export default {
  name: "imagine",
  author: "Kaguya Project",
  role: "member",
  description: "Generate an image based on the input text.",

  execute: async function ({ api, event }) {
    const args = event.body.split(" ");
    let prompt = args.join(" ");

    if (!prompt || prompt.trim().length === 0) {
      api.sendMessage("⚠️ | Please enter a text to convert into an image.", event.threadID, event.messageID);
      return;
    }

    try {
      // Translate the text from Arabic to English
      const translationResponse = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(prompt)}`);
      prompt = translationResponse?.data?.[0]?.[0]?.[0];

      const apiUrl = `https://www.samirxpikachu.run.place/sd3-medium?prompt=${encodeURIComponent(prompt)}`;

      const response = await axios.get(apiUrl, { responseType: 'stream' });

      if (!response.data) {
        api.sendMessage("Failed to retrieve the image.", event.threadID, event.messageID);
        return;
      }

      const downloadDirectory = process.cwd();
      const filePath = path.join(downloadDirectory, 'cache', `${Date.now()}.jpg`);

      const fileStream = fs.createWriteStream(filePath);
      response.data.pipe(fileStream);

      fileStream.on('finish', async () => {
        const messageBody = 'KAGUYA RESPONSE:\n࿇ ══━━━━✥◈✥━━━━══ ࿇\n✅ | Image generated successfully \n࿇ ══━━━━✥◈✥━━━━══ ࿇';

        api.sendMessage({
          body: messageBody,
          attachment: fs.createReadStream(filePath)
        }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
      });

      fileStream.on('error', (error) => {
        api.sendMessage("An error occurred while downloading the image. Please try again later.", event.threadID);
        console.error("Error downloading the image:", error);
      });
    } catch (error) {
      api.sendMessage("An error occurred while processing the request. Please try again later.", event.threadID);
      console.error("Error processing the request:", error);
    }
  }
};
