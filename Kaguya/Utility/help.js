import axios from 'axios';
import request from 'request';

class Help {
  constructor() {
    this.name = "help";
    this.author = "Arjhil Dacayanan";
    this.cooldowns = 10;
    this.description = "View the bot's command list!";
    this.role = "member";
    this.aliases = ["Help to see command"];
    this.commands = global.client.commands;
  }

  roleText = (role) => ({ member: "User", Admin: "Group Admin", owner: "Bot Owner" }[role] || "Unknown");

  aliasesText = (aliases) => (Array.isArray(aliases) && aliases.length > 0 && !aliases.includes("") ? aliases.join(", ") : "None");

  async execute({ args, event, api  }) {
    const [pageStr] = args;
    const getCommands = this.commands.get(pageStr);

    if (!getCommands) {
      const page = parseInt(pageStr) || 1;
      const commandsPerPage = 10;
      const startIndex = (page - 1) * commandsPerPage;
      const endIndex = page * commandsPerPage;

      if (!isNaN(page) && page > 0) {
        const commandList = Array.from(this.commands.values());
        const totalPages = Math.ceil(commandList.length / commandsPerPage);

        if (page <= totalPages) {
          const commandsToDisplay = commandList.slice(startIndex, endIndex);

          let msg = `╔══════════════╗\n`;
          msg += `     𝐏𝐑𝐎𝐉𝐄𝐂𝐓 𝐊𝐀𝐆𝐔𝐘𝐀\n`;
          msg += `╚══════════════╝\n\n`;

          msg += `╭─『 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓 』\n`;

          commandsToDisplay.forEach((command) => {
            msg += `│✧ ${command.name.padEnd(20)}\n`;
          });

          msg += `╰───────────────◊\n`;
          msg += `To view detailed ${global.client.config.prefix}${this.name}`;
          msg += `\n Usage: ${global.client.config.prefix}${this.name} <page> to navigate to the next page!`;

          api.shareContact(msg, api.getCurrentUserID(), event.threadID, (err, info) => {
            client.handler.reply.set(info.messageID, {
              name: this.name,
              type: "info",
              author: event.senderID,
              commands: commandList,
            });
            setTimeout(() => kaguya.unsend(info.messageID), 50000);
          });

        } else {
          kaguya.reply("❌ There are no commands to display.");
        }
      }
    } else {
      const replyMsg = `
╭─『 ${getCommands.name.toUpperCase()} 』
│✧ Name: ${getCommands.name}
│✧ Author: ${getCommands.author}
│✧ Cooldown: ${getCommands.cooldowns}s
│✧ Description: ${getCommands.description}
│✧ Aliases: ${this.aliasesText(getCommands.aliases)}
╰───────────────◊
`;
      kaguya.reply(replyMsg);
    }
  }

  async onReply({ reply, event }) {
    if (reply.author !== event.senderID) return;
    const commandName = event.body.toLowerCase();
    const getCommands = reply.commands.find(cmd => cmd.name.toLowerCase() === commandName);

    if (!getCommands) {
      return kaguya.reply("❌ The command name you replied with is invalid! Please try again.");
    }

    const replyMsg = `
╭─『 ${getCommands.name.toUpperCase()} 』
│✧ Name: ${getCommands.name}
│✧ Author: ${getCommands.author}
│✧ Cooldown: ${getCommands.cooldowns}s
│✧ Description: ${getCommands.description}
│✧ Aliases: ${this.aliasesText(getCommands.aliases)}
╰───────────────◊
`;

    kaguya.reply(replyMsg, event.threadID, event.messageID);
  }
}

export default new Help();
