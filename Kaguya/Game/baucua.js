import request from "request";
import { existsSync, createWriteStream, createReadStream, mkdirSync } from "fs";

class BauCua {
  name = "baucua";
  author = "Arjhil Dacayanan";
  slotItems = ["ga", "tom", "bau", "cua", "ca", "nai"];
  images = { ga: "🐓", tom: "🦞", bau: "🍐", cua: "🦀", ca: "🐟", nai: "🦌" };
  description = "Bau Cua Tom Ca";
  cooldowns = 10;
  role = "member";
  aliases = [];

  async onLoad() {
    const cachePath = "./cache/baucua";
    if (!existsSync(cachePath)) mkdirSync(cachePath);

    for (const item of this.slotItems) {
      if (!existsSync(`./cache/baucua/${item}.jpg`)) {
        request(`https://i.imgur.com/${this.getImageCode(item)}.jpg`).pipe(createWriteStream(`./cache/baucua/${item}.jpg`));
      }
    }
  }

  async execute({ api, event, Economy, args }) {
    const [bet, moneyBet] = args;
    const moneyUser = (await Economy.getBalance(event.senderID)).data;
    const slotItems = this.slotItems;

    if (!slotItems.includes(bet) || isNaN(moneyBet) || moneyBet <= 0 || moneyBet > moneyUser || moneyBet < 50) {
      return api.sendMessage("Wrong format or invalid amount.", event.threadID);
    }

    const number = [...Array(3)].map(() => slotItems[Math.floor(Math.random() * slotItems.length)]);
    const item = args[0].toLowerCase();
    const icon = this.images[item];
    const [x1, x2, x3] = await this.get(number[0], number[1], number[2]);

    api.sendMessage({ body: "Shaking!", attachment: createReadStream("./cache/baucua/baucua.gif") }, event.threadID, async (error, info) => {
      await new Promise((resolve) => setTimeout(resolve, 5 * 1000));
      api.unsendMessage(info.messageID);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const array = [number[0], number[1], number[2]];
      const listimg = array.map((string) => createReadStream(`./cache/baucua/${string}.jpg`));
      const i = array.filter((item) => item === item).length;
      const prize = +i * +moneyBet + +moneyBet;

      await Economy[i ? "increase" : "decrease"](prize, event.senderID);
      api.sendMessage({ body: `Result: ${x1} | ${x2} | ${x3}\n[✤] ${i ? `Won ${prize}$, Because There Are ${i} ${icon}!` : `Lost ${moneyBet}$, Because There Are 0 ${icon}!`}`, attachment: listimg }, event.threadID, event.messageID);
    });
  }

  getImageCode(item) {
    return item === "bau" ? "4KLd4EE" : item === "cua" ? "s8YAaxx" : item === "ca" ? "YbFzAOU" : item === "nai" ? "UYhUZf8" : item === "tom" ? "4214Xx9" : "jPdZ1Q8";
  }

  async get(one, two, three) {
    return [this.images[one], this.images[two], this.images[three]];
  }
}

export default new BauCua();
