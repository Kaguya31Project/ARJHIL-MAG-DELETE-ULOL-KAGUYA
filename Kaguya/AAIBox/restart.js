class RestartCommand {
  name = "restart";
  author = "Arjhil Dacayanan";
  cooldowns = 0;
  description = "Restarts the bot with a countdown!";
  role = "owner";
  aliases = ["botrestart", "restartbot"];

  async execute({ api, event, client }) {
    if (!event || !event.threadID || !event.senderID) {
      console.error("Event object is missing critical information.");
      return api.sendMessage("Error: Unable to process the restart command. Event data is missing.", event?.threadID || null);
    }

    if (event.senderID !== "100040253298048") {
      return api.sendMessage("You don't have permission to use this command.", event.threadID);
    }

    try {
      // Ensure that client.handler and client.handler.reply are initialized
      if (!client.handler) {
        client.handler = {};  // Initialize client.handler if it doesn't exist
      }

      if (!client.handler.reply) {
        client.handler.reply = new Map();  // Initialize reply if it doesn't exist
      }

      await api.sendMessage("Are you sure you want to restart the bot? Type 'yes' to confirm.", event.threadID, (err, info) => {
        if (err) {
          console.error("Error sending message:", err);
          return api.sendMessage("An error occurred while sending the confirmation message.", event.threadID);
        }

        client.handler.reply.set(info.messageID, {
          name: "restart",
          author: event.senderID,
          type: "confirm",
        });
      });
    } catch (error) {
      console.error("Error:", error);
      return api.sendMessage("An error occurred while initiating the restart process.", event.threadID);
    }
  }

  async onReply({ api, event, reply }) {
    if (!event || !event.body || !event.senderID || !event.threadID) {
      console.error("Event object is missing critical information.");
      return;
    }

    if (reply.type === "confirm" && reply.author === event.senderID) {
      if (event.body.toLowerCase() === 'yes') {
        let countdown = 5;
        try {
          const countdownMessage = await api.sendMessage(`Restarting in ${countdown}...`, event.threadID, event.messageID);

          const countdownInterval = setInterval(async () => {
            countdown--;
            if (countdown > 0) {
              try {
                await api.editMessage(`Restarting in ${countdown}...`, countdownMessage.messageID);
              } catch (editError) {
                console.error("Error editing message:", editError);
              }
            } else {
              clearInterval(countdownInterval);
              try {
                await api.editMessage(`Kaguya restarting...`, countdownMessage.messageID);
              } catch (editError) {
                console.error("Error editing message:", editError);
              }
              console.log('Bot is restarting...');
              process.exit(1);
            }
          }, 1000);
        } catch (messageError) {
          console.error("Error sending countdown message:", messageError);
          return api.sendMessage("An error occurred during the restart countdown.", event.threadID);
        }
      } else {
        return api.sendMessage("Restart aborted.", event.threadID);
      }
    }
  }
}

export default new RestartCommand();
