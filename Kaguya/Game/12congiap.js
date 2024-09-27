export default {
  name: "zodiac",
  author: "Arjhil Dacayanan",
  cooldowns: 50,
  description: "View information about the 12 zodiac signs",
  role: "member",
  aliases: [],
  execute: async ({ api, event }) => {
    return api.sendMessage("==== Zodiac Signs ====\n1. Rat 🐁\n2. Ox 🐃\n3. Tiger 🐅\n4. Rabbit 🐈\n5. Dragon 🐉\n6. Snake 🐍\n7. Horse 🦓\n8. Goat 🐐\n9. Monkey 🐒\n10. Rooster 🐓\n11. Dog 🐕\n12. Pig 🐖\n\n🌹Reply with the number to learn more about each zodiac sign ❤", event.threadID, (err, info) => {
      client.handler.reply.set(info.messageID, {
        author: event.senderID,
        type: "pick",
        name: "zodiac",
        unsend: true,
      });
    });
  },
  onReply: async ({ api, event, reply }) => {
    if (reply.type === "pick") {
      const choices = [
        "Rat ( 🐁 )",
        "Ox ( 🐃 )",
        "Tiger ( 🐅 )",
        "Rabbit ( 🐈 )",
        "Dragon ( 🐉 )",
        "Snake ( 🐍 )",
        "Horse ( 🦓 )",
        "Goat ( 🐐 )",
        "Monkey ( 🐒 )",
        "Rooster ( 🐓 )",
        "Dog ( 🐕 )",
        "Pig ( 🐖 )"
      ];
      const choiceIndex = parseInt(event.body);
      if (isNaN(choiceIndex) || choiceIndex < 1 || choiceIndex > 12) {
        return api.sendMessage("Please enter a number from 1 to 12.", event.threadID);
      }
      const choiceDescription = choices[choiceIndex - 1];
      api.sendMessage(choiceIndex + ". " + choiceDescription + "\n\n" + getDescription(choiceIndex), event.threadID);
    }
  },
};

function getDescription(index) {
  const descriptions = [
    "Description for Rat zodiac sign.",
    "Description for Ox zodiac sign.",
    "Description for Tiger zodiac sign.",
    "Description for Rabbit zodiac sign.",
    "Description for Dragon zodiac sign.",
    "Description for Snake zodiac sign.",
    "Description for Horse zodiac sign.",
    "Description for Goat zodiac sign.",
    "Description for Monkey zodiac sign.",
    "Description for Rooster zodiac sign.",
    "Description for Dog zodiac sign.",
    "Description for Pig zodiac sign."
  ];

  return descriptions[index - 1];
}
