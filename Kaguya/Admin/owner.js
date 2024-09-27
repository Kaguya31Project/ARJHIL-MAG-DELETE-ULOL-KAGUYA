class OwnerInfoCommand {
  constructor() {
    this.name = "ownerinfo";
    this.version = "1.0.0";
    this.author = "Arjhil Dacayanan";
    this.cooldowns = 5;
    this.description = "Displays information about the bot owner or checks a specific Facebook URL.";
    this.role = "member";
    this.aliases = [];
    
    this.specificURL = "https://www.facebook.com/arjhil.dacayanan.73?mibextid=ZbWKwL";
    this.regExCheckURL = /https:\/\/www\.facebook\.com\/[a-zA-Z0-9\.]+/;
  }

  async execute({ api, event, args }) {
    try {
      const ownerName = "Arjhil Dacayanan";
      const ownerContact = "Arjhil27@gmail.com";

      const url = args.join(" ") || this.specificURL; 
      const isValidURL = this.regExCheckURL.test(url);

      let ownerInfoMessage = `
👤 Bot Owner Information:
━━━━━━━━━━━━━━━━━━
Name: ${ownerName}
Contact: ${ownerContact}
━━━━━━━━━━━━━━━━━━
`;

      if (isValidURL) {
        ownerInfoMessage += `🔗 Owner Fb: ${url}`;
      } else {
        ownerInfoMessage += "⚠️ The provided URL is not valid or not in the correct format.";
      }

      await api.sendMessage(ownerInfoMessage, event.threadID, event.messageID);
    } catch (error) {
      console.error("Error fetching owner info:", error);
      await api.sendMessage("❌ An error occurred while fetching owner information.", event.threadID, event.messageID);
    }
  }
}

export default new OwnerInfoCommand();
