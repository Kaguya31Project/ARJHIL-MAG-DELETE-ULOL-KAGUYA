import fs from "fs-extra";
import path from "path";

class CMD {
  constructor() {
    this.name = "cmd";
    this.author = "Arjhil Dacayanan";
    this.role = "owner";
    this.description = "Manage your plugins!";
    this.cooldown = 10;
    this.aliases = ["command", "commands"];
  }

  async execute({ args }) {
    const [type, commandName] = args;

    switch (type) {
      case "load":
        this.loadCommand(commandName);
        break;
      case "loadAll":
        this.loadAllCommands();
        break;
      default:
        const defaultName = `${global.client.config.prefix}${this.name}`;
        kaguya.reply(`[ CMD ]\n\n=> load <file name> (example ${defaultName} load cmd)\n=> loadAll to reload all commands!`);
        break;
    }
  }

  async loadCommand(commandName) {
    try {
      if (!commandName) {
        return kaguya.reply("Please provide the name of the plugin you want to load");
      }

      const pluginPath = this.findCommandPath(commandName);

      if (!pluginPath) {
        return kaguya.reply("Command not found!");
      }

      const [oldPlugins, plugins] = await this.loadPlugin(pluginPath);

      if (!plugins?.name || typeof plugins?.execute !== "function") {
        return kaguya.reply(`This command cannot be loaded!`);
      }

      if (global.client.commands.has(oldPlugins?.name)) {
        global.client.commands.delete(oldPlugins?.name);
      }

      global.client.commands.set(plugins.name, plugins);

      kaguya.reply(`[ CMD ]\nStatus: Success\nName: ${plugins.name}\nAuthor: ${plugins?.author}\nDescriptions: ${plugins?.description}`);
    } catch (err) {
      kaguya.reply("Could not load this command!");
    }
  }

  async loadAllCommands() {
    try {
      const dir = fs.readdirSync("./commands");
      for (const dirName of dir) {
        const commandsInDir = fs.readdirSync(`./commands/${dirName}`);
        for (const fileName of commandsInDir) {
          const commandPath = path.join("commands", dirName, fileName + ``);

          const [oldPlugins, plugins] = await this.loadPlugin(commandPath);

          if (plugins?.name && typeof plugins?.execute === "function") {
            if (global.client.commands.has(oldPlugins?.name)) {
              global.client.commands.delete(oldPlugins?.name);
            }

            global.client.commands.set(plugins.name, plugins);
          }
        }
      }

      kaguya.reply("[ CMD ]\nStatus: Success\nAll commands have been reloaded!");
    } catch (err) {
      kaguya.reply("Could not reload all commands!");
    }
  }

  findCommandPath(commandName) {
    const dir = fs.readdirSync("./commands");
    for (const dirName of dir) {
      const commandsInDir = fs.readdirSync(`./commands/${dirName}`);
      for (const fileName of commandsInDir) {
        if (fileName === `${commandName}.js`) {
          return path.join("commands", dirName, fileName + ``);
        }
      }
    }
    return null;
  }

  async loadPlugin(pluginPath) {
    const [oldPlugins, plugins] = await Promise.all([
      import("../../" + pluginPath),
      import("../../" + pluginPath + `?version=${Math.random()}`)
    ]);
    return [oldPlugins.default, plugins.default];
  }
}

export default new CMD();
