import getFBInfo from "@xaviabot/fb-downloader";
import axios from "axios";
import fs from "fs";
import path from "path";

const __dirname = path.resolve();
const line = "━━━━━━━━━━━━━━━━━━";

class MediaDownloadCommand {
  constructor() {
    this.name = "adown";
    this.author = "Arjhil";
    this.cooldowns = 3;
    this.description = "Automatically download TikTok, Facebook, and Capcut videos";
    this.role = "member";
    this.aliases = [];
  }

  async execute({ api, event, args }) {
    const link = args.join(" ");

    if (!link) {
      return api.sendMessage("Please provide a valid video link.", event.threadID, event.messageID);
    }

    const tiktokLinkRegex = /https:\/\/(www\.|vt\.|vm\.)?tiktok\.com\/.*$/;
    const facebookLinkRegex = /https:\/\/(www\.)?facebook\.com\/.*$/;
    const capcutLinkRegex = /https:\/\/(www\.)?capcut\.com\/t\/.*$/;

    if (tiktokLinkRegex.test(link)) {
      await this.downloadAndSendTikTokContent(link, api, event);
    } else if (facebookLinkRegex.test(link)) {
      await this.downloadAndSendFBContent(link, api, event);
    } else if (capcutLinkRegex.test(link)) {
      await this.downloadAndSendCapcutContent(link, api, event);
    } else {
      api.sendMessage("Unsupported link format. Please provide a valid TikTok, Facebook, or Capcut video link.", event.threadID, event.messageID);
    }
  }

  async downloadAndSendTikTokContent(url, api, event) {
    try {
      const response = await axios.post('https://www.tikwm.com/api/', { url });
      const data = response.data.data;
      const videoStream = await axios({
        method: 'get',
        url: data.play,
        responseType: 'stream'
      }).then(res => res.data);

      const fileName = `TikTok-${Date.now()}.mp4`;
      const filePath = path.join(__dirname, fileName);
      const videoFile = fs.createWriteStream(filePath);

      videoStream.pipe(videoFile);

      videoFile.on('finish', () => {
        videoFile.close(() => {
          api.sendMessage({
            body: `𝗧𝗶𝗸𝘁𝗼𝗸 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿\n${line}\nContent: ${data.title}\nLikes: ${data.digg_count}\nComments: ${data.comment_count}`,
            attachment: fs.createReadStream(filePath)
          }, event.threadID, () => {
            fs.unlinkSync(filePath);
          });
        });
      });
    } catch (e) {
      console.error(e);
      api.sendMessage(`Error downloading TikTok video: ${e.message}`, event.threadID, event.messageID);
    }
  }

  async downloadAndSendFBContent(url, api, event) {
    const fbvid = path.join(__dirname, 'video.mp4'); 
    try {
      const result = await getFBInfo(url); // Adjust this function call as needed
      let videoData = await axios.get(encodeURI(result.sd), { responseType: 'arraybuffer' });
      fs.writeFileSync(fbvid, Buffer.from(videoData.data, "utf-8"));

      api.sendMessage({
        body: `𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿\n${line}`,
        attachment: fs.createReadStream(fbvid)
      }, event.threadID, () => {
        fs.unlinkSync(fbvid);
      });
    } catch (e) {
      console.error(e);
      api.sendMessage(`Error downloading Facebook video: ${e.message}`, event.threadID, event.messageID);
    }
  }

  async downloadAndSendCapcutContent(url, api, event) {
    try {
      const response = await axios.get(`https://ccexplorerapisjonell.vercel.app/api/capcut?url=${url}`);
      const { result } = response.data;

      const capcutFileName = `Capcut-${Date.now()}.mp4`;
      const capcutFilePath = path.join(__dirname, capcutFileName);

      const videoResponse = await axios({
        method: 'get',
        url: result.video_ori,
        responseType: 'arraybuffer'
      });

      fs.writeFileSync(capcutFilePath, Buffer.from(videoResponse.data, 'binary'));

      api.sendMessage({
        body: `𝗖𝗮𝗽𝗰𝘂𝘁 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿\n${line}\n𝗧𝗶𝘁𝗹𝗲: ${result.title}\n𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${result.description}`,
        attachment: fs.createReadStream(capcutFilePath)
      }, event.threadID, () => {
        fs.unlinkSync(capcutFilePath);
      });
    } catch (e) {
      console.error(e);
      api.sendMessage(`Error downloading Capcut video: ${e.message}`, event.threadID, event.messageID);
    }
  }
}

export default new MediaDownloadCommand();
