const userCommand = {
  name: "user",
  author: "Arjhil Dacayanan",
  cooldowns: 0,
  description: "Ban users from using the bot",
  role: "owner",
  aliases: ["memberban", "banuser"],
  execute: async ({ api, event, Users, args }) => {
    var [type] = args;
    switch (type) {
      case "ban": {
        return api.sendMessage(`Please provide a reason for the ban: `, event.threadID, (err, info) => {
          client.handler.reply.set(info.messageID, {
            name: "user",
            author: event.senderID,
            type: "ban",
          });
        });
      }
      case "unban": {
        return api.sendMessage(`Please tag the user(s) you want to unban, for example: @1 @2 (you can tag multiple users)`, event.threadID, (err, info) => {
          client.handler.reply.set(info.messageID, {
            name: "user",
            author: event.senderID,
            type: "confirm",
            choose: "unban",
          });
        });
      }
    }
  },
  onReply: async ({ api, event, Users, reply }) => {
    switch (reply.type) {
      case "ban": {
        return api.sendMessage(
          `Please tag the user(s) you want to ban, for example: @1 @2 (you can tag multiple users)`,
          event.threadID,
          (err, info) => {
            client.handler.reply.set(info.messageID, {
              name: "user",
              author: event.senderID,
              type: "confirm",
              choose: "ban",
              reason: event.body,
            });
          },
          event.messageID
        );
      }
      case "confirm": {
        var msg = "",
          listUID = event.mentions;
        if (!Object.keys(listUID).length) {
          return api.sendMessage(`Invalid user IDs for ${reply.choose == "ban" ? "banning" : "unbanning"}. Please tag the user(s) you want to ${reply.choose == "ban" ? "ban" : "unban"}\n\nExample: @1 @2`, event.threadID, (err, info) => {
            client.handler.reply.set(info.messageID, {
              name: "user",
              author: event.senderID,
              type: "confirm",
              choose: reply.choose,
              reason: event.body,
            });
          });
        }
        for (let [uid, name] of Object.entries(listUID)) {
          var dataUser = await Users.ban(uid, { status: reply.choose == "ban" ? true : false, reason: reply.choose == "ban" ? reply.reason : "" });
          dataUser.status ? (msg += `${uid} - ✅ (${name})\n`) : (msg += `${uid} - ❌ (Null)\n`);
        }
        return api.sendMessage(`[ ${reply.choose == "ban" ? "BAN USER" : "UNBAN USER"} ]\n` + msg + `\n${reply.choose == "ban" ? `\nReason for ban: ${reply.reason}` : ""}\nTotal: ${Object.keys(listUID).length} user(s)\n✅ : Successful\n❌ : Failed\n(Failure is due to the lack of user data in the database)`, event.threadID, event.messageID);
      }
    }
  },
};

export default userCommand;
