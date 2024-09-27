class CatGPTAPICommand {
  name = "catgpt";
  author = "Arjhil Dacayanan";
  cooldowns = 60;
  description = "Fetches CatGPT response from the API!";
  role = "member";
  aliases = [];

  async execute({ event, Threads }) {
    try {
      const prompt = encodeURIComponent(event.body || "hi who are you?");
      const response = await fetch(`https://deku-rest-api.gleeze.com/api/catgpt?prompt=${prompt}`);

      if (!response.ok) {
        throw new Error(`catgpt responded with status ${response.status}`);
      }

      const data = await response.json();

      if (!data || !data.response) {
        throw new Error("No valid CatGPT response");
      }

      const result = data.response;

      const formattedMessage = `
 Kaguya CatGPT Response 🐾🤖: 

━━━━━━━━━━━━━━━

${result}

━━━━━━━━━━━━━━━
`;

      return kaguya.reply(formattedMessage);
    } catch (err) {
      console.error('Error while calling the CatGPT:', err);

      return kaguya.reply("An unexpected error occurred while calling the CatGPT API. Please try again later.");
    }
  }
}

export default new CatGPTAPICommand();