import { log } from "../logger/index.js";
export default {
  name: "subscribe",
  execute: async ({ api, event, Threads, Users }) => {
    var threads = (await Threads.find(event.threadID))?.data?.data;
    switch (event.logMessageType) {
      case "log:unsubscribe": {
        if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) {
          await Threads.remove(event.threadID);
          return log([
            {
              message: "[ THREADS ]: ",
              color: "yellow",
            },
            {
              message: `Deleted data of the group with TID: ${event.threadID} because the bot was kicked out of the group`,
              color: "green",
            },
          ]);
        }
        await Threads.update(event.threadID, {
          members: +threads.members - 1,
        });
        kaguya.reply(event.logMessageBody);
        break;
      }
      case "log:subscribe": {
        if (event.logMessageData.addedParticipants.some((i) => i.userFbId == api.getCurrentUserID())) {
          api.changeNickname(`Prefix: ${global.client.config.prefix} <=> ${!global.client.config.BOT_NAME ? "Github: ttkienn" : global.client.config.BOT_NAME}`, event.threadID, api.getCurrentUserID());
          return kaguya.send(`𝐏𝐑𝐎𝐉𝐄𝐂𝐓 𝐊𝐀𝐆𝐔𝐘𝐀 𝐀𝐂𝐓𝐈𝐕𝐀𝐓𝐄𝐃 \n━━━━━━━━━━━━━━━━━━\nConnection successful! This bot [ KAGUYA PROJECT ], created by Arjhil Dacayanan, is now available to you.\n\nThank you for your interest in our products. Have fun spending time with us!\n━━━━━━━━━━━━━━━━━━\n`, event.threadID);
        } else {
          for(let i of event.logMessageData.addedParticipants){
            await Users.create(i.userFbId);
          }
          await Threads.update(event.threadID, {
            members: +threads.members + +event.logMessageData.addedParticipants.length
          });
          return kaguya.send(event.logMessageBody);
        }
      }
    }
  },
};
