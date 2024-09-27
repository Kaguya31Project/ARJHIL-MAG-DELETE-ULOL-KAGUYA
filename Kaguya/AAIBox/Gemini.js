import axios from "axios";

class GeminiAPICommand {
  name = "gemini";
  author = "Arjhil Dacayanan";
  cooldowns = 60;
  description = "Fetches Gemini response";
  role = "member";

  async execute({ event, Threads }) {
    try {
      const uid = event.senderID || "";
      const prompt = encodeURIComponent(event.body || "");
      const apiUrl = `https://deku-rest-api.gleeze.com/gemini?prompt=${prompt}&uid=${uid}`;
      
      const response = await axios.get(apiUrl);

      if (response.status !== 200) {
        throw new Error(`Gemini responded with status ${response.status}`);
      }

      const data = response.data;
      const result = data.gemini || "No valid Gemini response from the API";

      const formattedMessage = `
 Kaguya Gemini Response 📜🖋️: 

━━━━━━━━━━━━━━━

${result}

━━━━━━━━━━━━━━━
`;

      return kaguya.reply(formattedMessage);
    } catch (err) {
      console.error('Error calling the Gemini API:', err.message);
      return kaguya.reply("An unexpected error occurred while calling the Gemini API!");
    }
  }
}

export default new GeminiAPICommand();
