import axios from "axios";

class LlamaCommand {
  name = "llama";
  author = "Arjhil Dacayanan";
  cooldowns = 60;
  description = "Fetches a response from the Llama-3-70B API";
  role = "member";

  async execute({ event }) {
    try {
      const prompt = encodeURIComponent(event.body || "");
      if (!prompt) {
        return kaguya.reply("🤖 Usage: llama <your prompt>");
      }

      const apiUrl = `https://deku-rest-api.gleeze.com/api/llama-3-70b?q=${prompt}`;
      const response = await axios.get(apiUrl);

      console.log("API Response:", response.data);

      const llamaResponse = response.data.response || "No valid response from the Llama API";

      const formattedMessage = `
Kaguya Llama-3-70B Response 📜:

━━━━━━━━━━━━━━━

${llamaResponse}

━━━━━━━━━━━━━━━
`;

      return kaguya.reply(formattedMessage);
    } catch (err) {
      console.error('Error calling the Llama API:', err.message);
      return kaguya.reply("🤖 An unexpected error occurred while calling the Llama API.");
    }
  }
}

export default new LlamaCommand();
