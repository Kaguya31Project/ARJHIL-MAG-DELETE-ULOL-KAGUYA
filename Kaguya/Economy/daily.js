class CheckTT {
  name = "daily";
  author = "Arjhil Dacayanan";
  cooldowns = 10;
  description = "Check in daily to receive coins";
  role = "member";
  aliases = ["checkin"];

  async execute({ api, event, Economy, Users }) {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeStamps = 24 * 60 * 60;
    try {
      const lastCheckedTime = await Users.find(event.senderID);
      if (lastCheckedTime?.data?.data?.other?.cooldowns && currentTime - parseInt(lastCheckedTime?.data?.data?.other?.cooldowns) < timeStamps) {
        const remainingTime = timeStamps - (currentTime - lastCheckedTime?.data?.data?.other?.cooldowns);
        const hours = Math.floor(remainingTime / 3600);
        const minutes = Math.floor((remainingTime % 3600) / 60);
        const seconds = remainingTime % 60;
        return api.sendMessage(`You have already checked in. Remaining cooldown time: ${hours} hours ${minutes} minutes ${seconds} seconds.`, event.threadID);
      }

      const coinsToAdd = 10000;

      await Economy.increase(coinsToAdd, event.senderID);
      await Users.update(event.senderID, {
        other: {
          cooldowns: currentTime,
        },
      });
      api.sendMessage(`Check in successful!\nYour reward is: ${coinsToAdd} coins.`, event.threadID);
    } catch (error) {
      console.error("Error while performing check-in:", error);
    }
  }
}

export default new CheckTT();
