import axios from "axios";

class SpotifyAPICommand {
  constructor() {
    this.name = "spotify";
    this.author = "Arjhil Dacayanan";
    this.cooldowns = 10;
    this.description = "Search for music on Spotify";
    this.role = "member";
    this.aliases = ["music search"];
  }

  async execute({ api, event, args }) {
    const keySearch = args.join(" ");

    if (!keySearch) {
      return api.sendMessage(
        'Please enter a search keyword, e.g., spotify [song/artist name]',
        event.threadID,
        event.messageID
      );
    }

    try {
      const res = await axios.get(`https://deku-rest-api.gleeze.com/search/spotify?q=${encodeURIComponent(keySearch)}`);

      const data = res.data.data;
      if (!data || data.length === 0) {
        return api.sendMessage(
          `No results found for "${keySearch}". Please try a different keyword.`,
          event.threadID,
          event.messageID
        );
      }

      let messageBody = `Spotify Search Results for "${keySearch}":\n\n`;
      data.forEach((item, index) => {
        messageBody += `${index + 1}. ${item.name} by ${item.artist}\n`;
        messageBody += `Link: ${item.url}\n\n`;
      });

      api.sendMessage(messageBody, event.threadID, event.messageID);

    } catch (error) {
      console.error("Error in SpotifyAPICommand execute method:", error.message);
      api.sendMessage(
        `❌ An error occurred while fetching results: ${error.message}`,
        event.threadID,
        event.messageID
      );
    }
  }
}

export default new SpotifyAPICommand();
