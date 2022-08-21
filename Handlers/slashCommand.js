const fs = require("fs");
const chalk = require("chalk");

const { PermissionsBitField } = require("discord.js");
const { Routes } = require("discord-api-types/v9");
const { REST } = require("@discordjs/rest");
const chalk = require("chalk");

const AsciiTable = require("ascii-table");
const table = new AsciiTable()
  .setHeading("⠀⠀⠀⠀⠀", "⠀⠀⠀⠀Slash Commands⠀⠀⠀⠀", "⠀⠀Status⠀⠀")
  .setBorder("┋", "═", "●", "●")
  .setAlign(2, AsciiTable.CENTER);

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const rest = new REST({ version: "9" }).setToken(TOKEN);

module.exports = (client) => {
  const slashCommands = [];
  var i = 0;
  fs.readdirSync("./Commands/slashCommands/").forEach(async (dir) => {
    const files = fs
      .readdirSync(`./Commands/slashCommands/${dir}/`)
      .filter((file) => file.endsWith(".js"));

    for (const file of files) {
      const slashCommand = require(`../Commands/slashCommands/${dir}/${file}`);
      slashCommands.push({
        name: slashCommand.name,
        description: slashCommand.description,
        type: slashCommand.type,
        options: slashCommand.options ? slashCommand.options : null,
        default_permission: slashCommand.default_permission
          ? slashCommand.default_permission
          : null,
        default_member_permissions: slashCommand.default_member_permissions
          ? PermissionsBitField.resolve(
              slashCommand.default_member_permissions
            ).toString()
          : null,
      });

      if (slashCommand.name) {
        client.slashCommands.set(slashCommand.name, slashCommand);
        i = i + 1;
        table.addRow(i.toString() + ".", file.split(".js")[0], "» 🌱 «");
      } else {
        i = i + 1;
        table.addRow(i.toString() + ".", file.split(".js")[0], "» 🔆 «");
      }
    }
  });
  console.log(chalk.white(table.toString()));
  console.log(chalk.cyan("\n\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀--- GemBot LOGS Area: ---\n\n"))
  (async () => {
    try {
      await rest.put(
        process.env.GUILD_ID
          ? Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID)
          : Routes.applicationCommands(CLIENT_ID),
        { body: slashCommands }
      );
      console.log(chalk.grey(new Date().toLocaleTimeString()), '[CLIENT]: Slash Commands • Registered');
    } catch (error) {
      console.log(error);
    }
  })();
};
