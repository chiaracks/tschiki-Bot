const chalk = require("chalk");
const fs = require("fs");
var AsciiTable = require("ascii-table");
var table = new AsciiTable();
table
  .setHeading("⠀⠀⠀⠀⠀", "⠀⠀⠀Prefix Commands⠀⠀⠀⠀", "⠀⠀Status⠀⠀")
  .setBorder("┋", "═", "●", "●")
  .setAlign(2, AsciiTable.CENTER);

module.exports = (client) => {
  var i = 0;
  fs.readdirSync("./Commands/prefixCommands/").forEach((dir) => {
    const files = fs
      .readdirSync(`./Commands/prefixCommands/${dir}/`)
      .filter((file) => file.endsWith(".js"));
    if (!files || files.legnth <= 0) console.log(chalk.white("Commands - 0"));
    files.forEach((file) => {
      let command = require(`../Commands/prefixCommands/${dir}/${file}`);
      if (command) {
        client.commands.set(command.name, command);
        if (command.aliases && Array.isArray(command.aliases)) {
          command.aliases.forEach((alias) => {
            client.aliases.set(alias, command.name);
          });
        }
        i = i + 1;
        table.addRow(i.toString() + ".", command.name, "» 🌱 «");
      } else {
        i = i + 1;
        table.addRow(i.toString() + ".", file, "» 🔆 «");
      }
    });
  });
  console.log(chalk.white(table.toString()));
};
