import moment from "moment-timezone";

export default {
  name: "upt",
  author: "Kaguya Project",
  cooldowns: 60,
  description: "Bot data",
  role: "member",
  aliases: ["uptime"],
  execute: async ({ args, api, event }) => {
    const currentTime = moment().tz('Asia/Manila').format('YYYY-MM-DD hh:mm:ss A');

    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime - (hours * 3600)) / 60);
    const seconds = Math.floor(uptime % 60);
    const uptimeStr = `The bot has been running for ${hours} hours, ${minutes} minutes, and ${seconds} seconds`;

    const threads = await api.getThreadList(99999, null, ['INBOX']);

    let userCount = 0;
    let groupCount = 0;

    threads.forEach(thread => {
      if (thread.isGroup) {
        groupCount++;
      } else {
        userCount++;
      }
    });

    const output = `Kaguya Status\n\n━━━━━━━━━━━━━━━━━━\n\n` +
      `Current time ⏰: ${currentTime},\n` +
      `Total number of users 🧿: ${userCount}\n` +
      `Total number of groups 🗝️: ${groupCount}\n\n` +
      `${uptimeStr}\n\n━━━━━━━━━━━━━━━━━━`;

    api.shareContact(output, api.getCurrentUserID(), event.threadID);
  }
};
