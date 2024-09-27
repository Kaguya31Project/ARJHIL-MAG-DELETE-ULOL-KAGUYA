class JackpotGame {
  name = "jackpot";
  author = "Arjhil Dacayanan";
  cooldowns = 10;
  description = "An adventure of fruit gambling with Jackpot chance!";
  role = "member";
  aliases = [];

  async execute({ api, event, Economy, args }) {
    const MIN_BET_AMOUNT = 1000;
    const MAX_BET_AMOUNT = 500000;
    const SLOT_ITEMS = ["🍇", "🍉", "🍊", "🍏", "7⃣", "🍓", "🍒", "🍌", "🥝", "🥑", "🌽"];
    const { increase, decrease, getBalance } = Economy;

    const userMoney = (await getBalance(event.senderID)).data;

    const [moneyBet] = args;

    if (isNaN(moneyBet) || moneyBet <= 0) {
      return api.sendMessage("Invalid betting amount!", event.threadID);
    }

    if (moneyBet > userMoney) {
      return api.sendMessage(`You lack ${kaguya.formatCurrency(moneyBet - userMoney)} to place the bet!`, event.threadID);
    }

    if (moneyBet < MIN_BET_AMOUNT || moneyBet > MAX_BET_AMOUNT) {
      return api.sendMessage(`Invalid betting amount!\nMinimum: ${kaguya.formatCurrency(MIN_BET_AMOUNT)}\nMaximum: ${kaguya.formatCurrency(MAX_BET_AMOUNT)}`, event.threadID);
    }

    const spins = Array.from({ length: 3 }, () => SLOT_ITEMS[Math.floor(Math.random() * SLOT_ITEMS.length)]);

    var winMultiplier = calculateWinMultiplier(spins);

    const hasJackpot = Math.random() < 0.05;

    if (hasJackpot) {
      winMultiplier = 10;
    }

    const winnings = moneyBet * winMultiplier;
    const isWin = winMultiplier > 1;

    if (isWin) {
      await increase(winnings, event.senderID);
      api.sendMessage(`🎰 ${spins.join(" | ")} 🎰\nCongratulations! You won ${kaguya.formatCurrency(winnings)}.`, event.threadID);
    } else {
      await decrease(moneyBet, event.senderID);
      api.sendMessage(`🎰 ${spins.join(" | ")} 🎰\nSorry, you lost ${kaguya.formatCurrency(moneyBet)}.`, event.threadID);
    }

    if (hasJackpot) {
      api.sendMessage("🎉🎉🎉 You hit the Jackpot! 🎉🎉🎉\nYou have won a big prize!", event.threadID);
    }
  }
}

function calculateWinMultiplier(spins) {
  if (spins.every((symbol) => symbol === "7⃣")) {
    return 10;
  } else if (spins[0] === spins[1] && spins[1] === spins[2]) {
    return 3;
  } else if (spins[0] === spins[1] || spins[0] === spins[2] || spins[1] === spins[2]) {
    return 2;
  } else {
    return 1;
  }
}

export default new JackpotGame();
