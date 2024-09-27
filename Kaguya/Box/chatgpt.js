import axios from 'axios';

class ChatGPTCommand {
  name = 'chatgpt';
  version = '1.0.0';
  role = 0;
  hasPrefix = true;
  aliases = ['gpt'];
  description = 'Chat with GPT model';
  usage = 'chatgpt [your message]';
  credits = 'Arjhil';
  cooldown = 3;

  async execute({ api, event, args }) {
    const userMessage = args.join(' ');
    if (!userMessage) {
      return api.sendMessage('Kaguya Gpt4 Response:\n━━━━━━━━━━━━━━━━━━\nPlease provide a message to send to ChatGPT.\n━━━━━━━━━━━━━━━━━━', event.threadID);
    }

    const apiUrl = `https://jonellccprojectapis10.adaptable.app/api/chatgpt?input=${encodeURIComponent(userMessage)}`;

    await api.sendMessage('⌛ Kaguya Thinking...', event.threadID);

    try {
      const response = await axios.get(apiUrl);
      const gptResponse = response.data.result;

      const formattedResponse = `🤖 Kaguya Gpt4 Response\n━━━━━━━━━━━━━━━━━━\n${gptResponse.trim()}\n━━━━━━━━━━━━━━━━━━`;

      api.sendMessage(formattedResponse, event.threadID);
    } catch (error) {
      await api.sendMessage('❌ An error occurred while trying to reach ChatGPT. Please try again later.', event.threadID);
    }
  }
}

export default new ChatGPTCommand();
