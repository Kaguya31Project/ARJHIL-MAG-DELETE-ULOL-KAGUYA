import axios from 'axios';
import request from 'request';

class MenuCommand {
  constructor() {
    this.name = "menu";
    this.author = "Arjhil Dacayanan";
    this.cooldowns = 10;
    this.description = "View all bot commands!";
    this.role = "member";
    this.aliases = [];
    this.commands = global.client.commands;
  }

  roleText = (role) => ({ member: "User", Admin: "Group Admin", owner: "Bot Owner" }[role] || "Unknown");

  aliasesText = (aliases) => (Array.isArray(aliases) && aliases.length > 0 && !aliases.includes("") ? aliases.join(", ") : "None");

  async execute({ event, api }) {
    const commandList = Array.from(this.commands.values());
    const totalCommands = commandList.length;
    const commandsPerPage = 100;

    let msg = `╔═══════════╗\n
    𝐏𝐑𝐎𝐉𝐄𝐂𝐓 𝐊𝐀𝐆𝐔𝐘𝐀\n╚═══════════╝\n\n`;
    msg += `╭─『 𝐌𝐄𝐍𝐔 𝐋𝐈𝐒𝐓 』\n`;

    commandList.forEach((command, index) => {
      if (index % commandsPerPage === 0 && index > 0) {
        msg += `╰───────────◊\n`;
      }
      msg += `│✧${command.name} \n`;
    });

    msg += `\n╰───────────◊\n`;
    msg += `Total Commands: ${totalCommands}`;
    msg += `\n\n${global.client.config.prefix}Menu ( command ) name to view detailed help for a command.`;

    // Share contact instead of sending GIF
    api.shareContact(msg, api.getCurrentUserID(), event.threadID);
  }

  async onReply({ reply, event, api }) {
    if (reply.author !== event.senderID) return;

    const commandName = event.body.toLowerCase();
    const getCommand = reply.commands.find(cmd => cmd.name.toLowerCase() === commandName);

    if (!getCommand) {
      return api.sendMessage("❌ Invalid command name! Please try again.", event.threadID, event.messageID);
    }

    const replyMsg = `
╭─『 ${getCommand.name.toUpperCase()} 』
│✧Name: ${getCommand.name}
│✧Author: ${getCommand.author}
│✧Cooldown: ${getCommand.cooldowns}s
│✧Description: ${getCommand.description}
│✧Aliases: ${this.aliasesText(getCommand.aliases)}
╰───────────◊
`;

    // Share contact for the reply
    api.shareContact(replyMsg, api.getCurrentUserID(), event.threadID);
  }
}

export default new MenuCommand();
