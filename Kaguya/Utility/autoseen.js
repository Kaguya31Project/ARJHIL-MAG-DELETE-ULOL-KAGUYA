class AutoSeen {
  name = "autoseen";
  author = "Arjhil Dacayanan";
  cooldowns = 60;
  description = "Automatically mark messages as seen!";
  role = "owner";
  aliases = ["as"];
  config = false;
  async events({ api }) {
    this.config && api.markAsReadAll(() => {});
  }
  async execute() {
    this.config = this.config ? false : true;
    return kaguya.reply(`Auto Seen feature ${this.config ? "enabled" : "disabled"}`);
  }
}

export default new AutoSeen();
