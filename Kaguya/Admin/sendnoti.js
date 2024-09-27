const sendNotificationCommand = {
  name: "sendnoti",
  author: "Arjhil",
  cooldowns: 5,
  description: "Send notifications to all groups!",
  role: "admin",
  aliases: ["Send Noti"],
  execute: async ({ api, event, args, Threads }) => {
    const content = args.join(" ");
    if (!content) return api.sendMessage("Please enter the content you want to send to all groups!", event.threadID, event.messageID);

    let successCount = 0;
    let failCount = 0;

    try {
      const { data: allThreads } = await Threads.getAll();

      for (const value of allThreads) {
        if (!isNaN(parseInt(value.threadID)) && value.threadID !== event.threadID) {
          const { error } = await sendMessage(api, `[ Notification from admin ]\n\n${content}`, value.threadID);
          if (error) {
            failCount++;
          } else {
            successCount++;
          }
        }
      }

      return api.sendMessage(`[ SENDNOTI ]\nSuccess: ${successCount}\nFailures: ${failCount}`, event.threadID, event.messageID);
    } catch (err) {
      return api.sendMessage(`Error: ${err}`, event.threadID, event.messageID);
    }
  },
};

async function sendMessage(api, message, threadID) {
  return new Promise((resolve) => api.sendMessage(message, threadID, (error) => resolve({ error })));
}

export default sendNotificationCommand;
