import axios from 'axios';

class ChatGPTCommand {
  name = 'chatgpt';
  version = '1.0.0';
  role = 0;
  hasPrefix = true;
  aliases = ['chat'];
  description = 'Chat GPT4 model';
  usage = 'chatgpt [your message]';
  credits = 'Arjhil';
  cooldown = 3;

  async execute({ api, event, args }) {
    const userMessage = args.join(' ');
    if (!userMessage) {
      return api.sendMessage('Kaguya Gpt4 Response:\n━━━━━━━━━━━━━━━━━━\nPlease provide a message to send to ChatGPT.\n━━━━━━━━━━━━━━━━━━', event.threadID);
    }

    const initialMessage = await api.sendMessage('⌛ Kaguya Thinking...', event.threadID);

    try {
      const response = await axios.get(`https://jonellccprojectapis10.adaptable.app/api/chatgpt?input=${encodeURIComponent(userMessage)}`);
      const gptResponse = response.data.result;

      const formattedResponse = `🤖 Kaguya Gpt4 Response\n━━━━━━━━━━━━━━━━━━\n${gptResponse.trim()}\n━━━━━━━━━━━━━━━━━━`;

      return api.editMessage(formattedResponse, initialMessage.messageID, event.threadID);
    } catch (error) {
      return api.editMessage('❌ An error occurred while trying to reach ChatGPT. Please try again later.', initialMessage.messageID, event.threadID);
    }
  }
}

export default new ChatGPTCommand();