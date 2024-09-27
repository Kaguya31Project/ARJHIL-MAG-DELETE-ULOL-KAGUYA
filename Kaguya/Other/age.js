import moment from "moment-timezone";

export default {
  name: "age",
  author: "Arjhil Dacayanan",
  cooldowns: 60,
  description: "Age calculator",
  role: "member",
  aliases: ["asia/manila"],
  execute: async ({ args, api }) => {
    const userInput = args[0];

    if (!userInput) {
      return api.sendMessage(`Please enter the correct format.\nExample: ${global.client.config.prefix}age 16-07-2005`);
    }

    const [dayOfBirth, monthOfBirth, yearOfBirth] = userInput.split("-").map(Number);

    if (!dayOfBirth || isNaN(dayOfBirth) || dayOfBirth > 31 || dayOfBirth < 1 || !monthOfBirth || isNaN(monthOfBirth) || monthOfBirth > 12 || monthOfBirth < 1 || !yearOfBirth) {
      return api.sendMessage("Invalid day, month, or year of birth!", event.threadID);
    }

    const [currentDay, currentMonth, currentYear] = moment.tz("Asia/Manila").format("DD/MM/YYYY").split("/").map(Number);

    const yearsPassed = currentYear - yearOfBirth;
    const monthsPassed = currentMonth - monthOfBirth + yearsPassed * 12;
    const daysPassed = currentDay - dayOfBirth + monthsPassed * 30;

    return api.sendMessage(`Current age: ${yearsPassed} years, passed: ${monthsPassed} months, total days: ${daysPassed} days`);
  },
};
