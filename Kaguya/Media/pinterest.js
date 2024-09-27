import axios from "axios";
import fs from "fs";
import path from "path";

const __dirname = path.resolve();

class PinterestAPICommand {
  constructor() {
    this.name = "pinterest";
    this.author = "Arjhil Dacayanan";
    this.cooldowns = 10;
    this.description = "Image search";
    this.role = "member";
    this.aliases = ["img search"];
  }

  async execute({ api, event, args }) {
    const keySearch = args.join(" ");

    if (!keySearch.includes("-")) {
      return api.sendMessage(
        'Please enter in the format: pinterest [keyword] - [number] (e.g., pinterest ArjhilPogi - 10). The number specifies how many images you want in the result.',
        event.threadID,
        event.messageID
      );
    }

    const [keySearchs, numberSearch] = keySearch.split(" - ");
    const number = parseInt(numberSearch) || 6;

    try {
      const { data: { result: data } } = await axios.get(
        `https://deku-rest-api.gleeze.com/api/pinterest?q=${encodeURIComponent(keySearchs)}`
      );

      if (!data || !Array.isArray(data) || data.length === 0) {
        return api.sendMessage(
          'No images found for the given search term.',
          event.threadID,
          event.messageID
        );
      }

      const cacheDir = path.join(__dirname, 'cache', 'Pinterest');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      let num = 0;
      const imgData = [];

      for (let i = 0; i < number; i++) {
        if (i >= data.length) break;

        const imageUrl = data[i];
        if (!imageUrl) {
          continue;
        }

        const imagePath = path.join(cacheDir, `${num + 1}.jpg`);
        try {
          const getDown = (await axios.get(imageUrl, { responseType: "arraybuffer" })).data;
          fs.writeFileSync(imagePath, Buffer.from(getDown, "binary"));
          imgData.push(fs.createReadStream(imagePath));
          num++;
        } catch (downloadError) {
          return api.sendMessage(
            `Error downloading image ${i + 1}: ${downloadError.message}`,
            event.threadID,
            event.messageID
          );
        }
      }

      if (imgData.length === 0) {
        return api.sendMessage(
          'No images could be downloaded. Please try with a different search term or number of images.',
          event.threadID,
          event.messageID
        );
      }

      // Send text and images together
      await api.sendMessage(
        {
          attachment: imgData,
          body: `Kaguya Pinterest Image You Search: ${keySearchs}
        ━━━━━━━━━━━━━━━`,
        },
        event.threadID,
        event.messageID
      );

      // Clean up cached files
      for (let ii = 1; ii <= num; ii++) {
        try {
          fs.unlinkSync(path.join(cacheDir, `${ii}.jpg`));
        } catch (unlinkError) {
          return api.sendMessage(
            `Error deleting file ${ii}.jpg: ${unlinkError.message}`,
            event.threadID,
            event.messageID
          );
        }
      }
    } catch (error) {
      return api.sendMessage(
        `❌ An error occurred: ${error.message}`,
        event.threadID,
        event.messageID
      );
    }
  }
}

export default new PinterestAPICommand();
