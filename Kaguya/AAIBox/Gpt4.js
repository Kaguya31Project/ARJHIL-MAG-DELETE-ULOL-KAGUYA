class GPT4APICommand {
  name = "gpt4";
  author = "Arjhil Dacayanan";
  cooldowns = 60;
  description = "Fetches GPT-4 response from the API!";
  role = "member";
  aliases = [];

  async execute({ event, Threads }) {
    try {
      const uid = event.senderID || "default_uid";
      const response = await fetch(`https://deku-rest-api.gleeze.com/gpt4?prompt=${encodeURIComponent(event.body)}&uid=${uid}`);

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();

      const result = data.gpt4 || "No valid GPT-4 response from the API";

      // additional 
      const formattedMessage = `
 Kaguya Gpt4 Response 📜🖋️: 

━━━━━━━━━━━━━━━

${result}

━━━━━━━━━━━━━━━
`;

      return kaguya.reply(formattedMessage);
    } catch (err) {
      console.error(err);
      return kaguya.reply("An unexpected error occurred while calling the GPT-4 API!");
    }
  }
}

export default new GPT4APICommand();
