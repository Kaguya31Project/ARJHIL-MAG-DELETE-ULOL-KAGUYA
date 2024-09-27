import axios from "axios";

class GemmaCommand {
  name = "gemma";
  author = "Arjhil Dacayanan";
  cooldowns = 60;
  description = "Fetches a response from the Gemma-7B API";
  role = "member";

  async execute({ event }) {
    try {
      const prompt = encodeURIComponent(event.body || "");
      if (!prompt) {
        return kaguya.reply("🤖 Usage: gemma <your prompt>");
      }

      const apiUrl = `https://deku-rest-api.gleeze.com/api/gemma-7b?q=${prompt}`;
      const response = await axios.get(apiUrl);

      console.log("API Response:", response.data);

      const gemmaResponse = response.data.answer || response.data.result || "No valid response from the Gemma API";

      const formattedMessage = `
Kaguya Gemma-7B Response 📜:
━━━━━━━━━━━━━━━

${gemmaResponse}

━━━━━━━━━━━━━━━
`;

      return kaguya.reply(formattedMessage);
    } catch (err) {
      console.error('Error calling the Gemma API:', err.message);
      return kaguya.reply("🤖 An unexpected error occurred while calling the Gemma API.");
    }
  }
}

export default new GemmaCommand();
