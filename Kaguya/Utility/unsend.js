export default {
  name: "unsend",
  author: "Arjhil Dacayanan",
  cooldowns: 10,
  description: "Delete bot's message",
  role: "member",
  aliases: ["delete"],
  execute: async ({ api, event }) => {
    if (event?.messageReply?.senderID != api.getCurrentUserID()) {
      return kaguya.reply("Cannot delete messages from others!");
    }

    return kaguya.unsend(event.messageReply.messageID, (err) => {
      if (err) {
        return kaguya.reply("An error occurred, please try again later!");
      }
    });
  },
  events: async ({ api, event }) => {
    var reaction = ["😢"];
    if (event.reaction && event.senderID == api.getCurrentUserID() && reaction.includes(event.reaction)) {
      kaguya.unsend(event.messageID);
    }
  },
};
