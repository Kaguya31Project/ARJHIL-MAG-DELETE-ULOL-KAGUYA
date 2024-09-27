export default {
  name: "example",
  author: "Arjhil Dacayanan",
  cooldowns: 50,
  description: "Basic command template",
  role: "member",
  aliases: ["ex", "1"],
  execute: async ({ api, event, Users, Threads, Economy }) => {
    // This is where you write code for the command
    return api.sendMessage("This is a basic command template", event.threadID, event.messageID);
  },
  events: async ({ api, event, Users, Threads, Economy }) => {
    // This is where you write code for events
  },
  onReply: async ({ api, event, reply, Users, Threads, Economy }) => {
    // This is where you write code for onReply actions
  },
  onReaction: async ({ api, event, reaction, Users, Threads, Economy }) => {
    // This is where you write code for handling reactions
  },
};
