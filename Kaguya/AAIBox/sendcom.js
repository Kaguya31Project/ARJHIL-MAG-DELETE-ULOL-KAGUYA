class SendComCommand {
  name = "sendcom";
  author = "Jonell Magallanes";
  cooldowns = 5;
  description = "Send a comment Post using bot";
  role = "member";

  async execute({ api, args, event}) {
    try {
      if (args.length < 2) {
        return kaguya.reply("Usage: sendcom [URL] [comment]");
      }

      const sendingMessage = await api.sendMessage("Sending Comment...", event.threadID, event.messageID);

      const url = args[0];
      const comment = args.slice(1).join(" ");

      const regexPfbid = /pfbid\w+/;
      const regexPostSegment = /\/posts\/(\w+)/;
      const regexGroupID = /\/groups\/[^/]+\/permalink\/(\d+)/;

      let postID = url.match(regexPfbid);

      if (!postID) {
        let match = url.match(regexPostSegment);
        if (!match) {
          match = url.match(regexGroupID);
        }
        postID = match ? match[1] : null;
      } else {
        postID = postID[0];
      }

      await api.sendMessage("Extracting URL POST Into POST ID...", event.threadID, event.messageID);

      if (!postID) {
        return api.sendMessage("Invalid URL. Please provide a valid Facebook post URL.", event.threadID, event.messageID);
      }

      await api.sendComment(comment, postID);

      const successMessage = `
𝗖𝗼𝗺𝗺𝗲𝗻𝘁 𝗣𝗼𝘀𝘁 𝗖𝗠𝗗 📜:
━━━━━━━━━━━━━━━━━━
Comment sent successfully!
POST ID: ${postID}
━━━━━━━━━━━━━━━━━━
      `;

      await api.sendMessage(successMessage, event.threadID, event.messageID);
    } catch (error) {
      console.error('Error sending comment:', error.message);
      await api.sendMessage(error.message, event.threadID, event.messageID);
    }
  }
}

export default new SendComCommand();
