import axios from "axios";
import fs from "fs";
import path from "path";

export default {
  name: "lyrics",
  author: "Kaguya Project",
  description: "Fetches song lyrics along with the artist's name",
  role: "member",
  execute: async ({ event, api }) => {
    const input = event.body;
    const title = input.slice(7); // Extracts the song title from the message

    axios
      .get(`https://sampleapi-mraikero-01.vercel.app/get/lyrics?title=${title}`)
      .then(response => {
        const result = response.data.result;
        if (result && result.s_title) {
          const message = `Song Title 📀: "${result.s_title}" by 🧾 ${result.s_artist}:\n\n${result.s_lyrics}`;

          const imagePath = path.join(process.cwd(), 'cache', 'lyrics.jpg');

          axios({
            method: 'GET',
            url: result.s_image,
            responseType: 'stream'
          }).then(response => {
            response.data.pipe(fs.createWriteStream(imagePath)).on('finish', () => {
              api.sendMessage({
                body: message,
                attachment: fs.createReadStream(imagePath)
              }, event.threadID);
            });
          }).catch(error => {
            console.error(error);
            api.sendMessage("❌ | An error occurred while fetching the image. Please try again later.", event.threadID);
          });
        } else {
          api.sendMessage("❌ | Could not find the requested song information. Please check the title and try again.", event.threadID);
        }
      })
      .catch(error => {
        console.error(error);
        api.sendMessage("❌ | An error occurred while fetching the lyrics and image. Please try again later.", event.threadID);
      });
  }
};
