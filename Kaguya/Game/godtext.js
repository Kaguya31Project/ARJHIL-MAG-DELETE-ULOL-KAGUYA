export default {
  name: "godtext",
  author: "Arjhil Dacayanan",
  role: "member",
  cooldowns: 10,
  description: "Convert your text into special characters!",

  async execute({ api, args, event }) {
    try {
      const content = args.join(" ").toLowerCase();

      if (!content) {
        return api.sendMessage("Missing the text you want to convert.\nPlease enter the complete text!", event.threadID);
      }

      const characterMap = {
        a: "ꋫ", b: "ꃃ", c: "ꏸ", d: "ꁕ",
        e: "ꍟ", f: "ꄘ", g: "ꁍ", h: "ꑛ",
        i: "ꂑ", j: "ꀭ", k: "ꀗ", l: "꒒",
        m: "ꁒ", n: "ꁹ", o: "ꆂ", p: "ꉣ",
        q: "ꁸ", r: "꒓", s: "ꌚ", t: "꓅",
        u: "ꐇ", v: "ꏝ", w: "ꅐ", x: "ꇓ",
        y: "ꐟ", z: "ꁴ"
      };

      return api.sendMessage(content.replace(/[a-z]/g, (char) => characterMap[char] || char), event.threadID);
    } catch (err) {
      console.error(err);
    }
  },
};
