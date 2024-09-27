import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';

export default {
  name: "sing",
  author: "Arjhil",
  cooldowns: 60,
  description: "Download a clip from YouTube",
  role: "member",
  aliases: ["song", "music"],

  async execute({ api, event }) {
    const input = event.body;
    const data = input.split(" ");

    if (data.length < 2) {
      return api.sendMessage("⚠️ | Please enter the name of the song.", event.threadID);
    }

    data.shift();
    const videoName = data.join(" ");

    try {
      const sentMessage = await api.sendMessage(`✔ | Searching for the requested song "${videoName}". Please wait...`, event.threadID);

      const searchUrl = `https://c-v1.onrender.com/yt/s?query=${encodeURIComponent(videoName)}`;
      const searchResponse = await axios.get(searchUrl);

      const searchResults = searchResponse.data;
      if (!searchResults || searchResults.length === 0) {
        return api.sendMessage("⚠️ | No results were found.", event.threadID);
      }

      let msg = '🎵 | The following results were found:\n';
      const selectedResults = searchResults.slice(0, 4); // Get only the first 4 results
      const attachments = [];

      for (let i = 0; i < selectedResults.length; i++) {
        const video = selectedResults[i];
        const videoIndex = i + 1;
        msg += `\n${videoIndex}. ❀ Title: ${video.title}`;

        // Download thumbnail and add to attachments
        const imagePath = path.join(process.cwd(), 'cache', `video_thumb_${videoIndex}.jpg`);
        const imageStream = await axios({
          url: video.thumbnail,
          responseType: 'stream',
        });

        const writer = fs.createWriteStream(imagePath);
        imageStream.data.pipe(writer);

        await new Promise((resolve) => {
          writer.on('finish', resolve);
        });

        attachments.push(fs.createReadStream(imagePath));
      }

      msg += '\n\n📥 | Please reply with a number to download and listen to the song.';

      api.unsendMessage(sentMessage.messageID);

      api.sendMessage({ body: msg, attachment: attachments }, event.threadID, (error, info) => {
        if (error) return console.error(error);

        global.client.handler.reply.set(info.messageID, {
          author: event.senderID,
          type: "pick",
          name: "song",
          searchResults: selectedResults,
          unsend: true
        });

        // Delete temporary images after sending the message
        attachments.forEach((file) => fs.unlinkSync(file.path));
      });

    } catch (error) {
      console.error('[ERROR]', error);
      api.sendMessage('🥱 ❀ An error occurred while processing the command.', event.threadID);
    }
  },

  async onReply({ api, event, reply }) {
    if (reply.type !== 'pick') return;

    const { author, searchResults } = reply;

    if (event.senderID !== author) {
      return api.sendMessage("⚠️ | This is not for you.", event.threadID);
    }

    const selectedIndex = parseInt(event.body, 10) - 1;

    if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= searchResults.length) {
      return api.sendMessage("❌ | Invalid response. Please reply with a valid number.", event.threadID);
    }

    const video = searchResults[selectedIndex];
    const videoUrl = video.videoUrl;

    try {
      const downloadUrl = `https://ccproject10-df3227f754.onlitegix.com/api/yt/audio?url=${encodeURIComponent(videoUrl)}`;
      const downloadResponse = await axios.get(downloadUrl);

      const audioFileUrl = downloadResponse.data.url; // Correctly handling the new API response format

      if (!audioFileUrl) {
        return api.sendMessage("⚠️ | No download link for the song was found.", event.threadID);
      }

      api.setMessageReaction("⬇️", event.messageID, (err) => {}, true);

      const fileName = `${event.senderID}.mp3`;
      const filePath = path.join(process.cwd(), 'cache', fileName);

      const writer = fs.createWriteStream(filePath);
      const audioStream = await axios({
        url: audioFileUrl,
        responseType: 'stream'
      });

      audioStream.data.pipe(writer);

      writer.on('finish', () => {
        if (fs.statSync(filePath).size > 26214400) {
          fs.unlinkSync(filePath);
          return api.sendMessage('❌ | The file cannot be sent because it is larger than 25MB.', event.threadID);
        }

        api.setMessageReaction("✅", event.messageID, (err) => {}, true);

        const message = {
          body: `✅ | The song has been downloaded:\n❀ Title: ${video.title}`,
          attachment: fs.createReadStream(filePath)
        };

        api.sendMessage(message, event.threadID, () => {
          fs.unlinkSync(filePath);
        });
      });

    } catch (error) {
      console.error('[ERROR]', error);
      api.sendMessage('🥱 ❀ An error occurred while processing the command.', event.threadID);
    }
  }
};
