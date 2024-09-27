export default {
  name: "adduser",
  author: "Kaguya Project",
  cooldowns: 10,
  description: "Add users to the group",
  role: "member",
  aliases: ["add"],
  async execute({ api, event, args }) {
    try {
      var [url] = args;
      if (!url) return kaguya.reply(`Invalid format!\nUsage: ${global.client.config.prefix}adduser [uid or link]`);

      if (/facebook\.com/.test(url)) {
        var match = url.match(/\b(?:https?:\/\/)?(?:www\.)?(?:m\.|mbasic\.)?facebook\.com\/(?!profile\.php)([a-zA-Z0-9.-]+)(?:\/)?/);
        if (match) url = match[1];
      }

      var entity_id = (await kaguya.findUID(url)).data.entity_id;
      var { participantIDs, approvalMode, adminIDs } = await api.getThreadInfo(event.threadID);
      if (participantIDs.includes(entity_id)) return kaguya.reply("User is already in the group!");

      api.addUserToGroup(entity_id, event.threadID, () => {
        if (approvalMode && !adminIDs.some((item) => item.id === api.getCurrentUserID())) return kaguya.reply("User added to the approval list!");
        return kaguya.reply("User added to the group successfully");
      });
    } catch (err) {
      console.log(err);
      kaguya.reply("Could not add user to the group, please try again later");
    }
  },
};
