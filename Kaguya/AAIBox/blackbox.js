class BlackboxAICommand {
  name = "blackbox";
  author = "Arjhil Dacayanan";
  cooldowns = 60;
  description = "Fetches Blackbox AI response from the API!";
  role = "member";
  aliases = [];

  async execute({ event, Threads }) {
    try {
      const uid = event.senderID || "default_uid";
      const response = await fetch(`https://deku-rest-api.gleeze.com/blackbox?prompt=${encodeURIComponent(event.body)}&uid=${uid}`);

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      const result = data.data || "No valid Blackbox AI response from the API";

      const formattedMessage = `
 Kaguya Blackbox Response 📜🖋️: 

━━━━━━━━━━━━━━━

${result}

━━━━━━━━━━━━━━━
`;

      return kaguya.reply(formattedMessage);
    } catch (err) {
      console.error(err);
      return kaguya.reply("An unexpected error occurred while calling the Blackbox AI API!");
    }
  }
}

export default new BlackboxAICommand();
