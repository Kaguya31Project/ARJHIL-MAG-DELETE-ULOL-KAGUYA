class CountCommand {
  name = "count";
  version = "1.0.0";
  author = "Arjhil Dacayanan";
  cooldowns = 5;
  description = "Counts the number of words, paragraphs, and alphanumeric characters in a given input string.";
  role = "member";
  aliases = ["wordcount", "charcount"];
  usePrefix = true;

  async execute({ api, event, args }) {
    try {
      const inputStr = args.join(" ");
      const wordCount = inputStr.split(" ").length;
      const paragraphCount = (inputStr.match(/\n\n/g) || []).length + 1;
      const alphanumericCount = (inputStr.match(/[a-zA-Z0-9]/g) || []).length;

      const message = `❯ There are ${wordCount} word(s), ${paragraphCount} paragraph(s), and ${alphanumericCount} alphanumeric character(s) in your input.`;

      return api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
      console.error("Error in count command:", error);
      return api.sendMessage("An error occurred while processing your input.", event.threadID, event.messageID);
    }
  }
}

export default new CountCommand();
