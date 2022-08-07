const fs = require("fs");
const chalk = require("chalk");
var AsciiTable = require("ascii-table");
var table = new AsciiTable();
table
  .setHeading("⠀⠀⠀⠀⠀", "⠀⠀⠀⠀⠀⠀⠀⠀Events⠀⠀⠀⠀⠀⠀⠀⠀", "⠀⠀Status⠀⠀")
  .setBorder("┋", "═", "●", "●")
  .setAlign(2, AsciiTable.CENTER);

module.exports = (client) => {
  var i = 0;
  console.log(
    chalk.cyan(
      `⠀⠀⠀⠀--- Welcome to GemBot Launcher! ---\n ⠀⠀⠀⠀⠀⠀-> For help DM Jonas#1713 \n\n`
    )
  );
  fs.readdirSync("./Events/").forEach((dir) => {
    const files = fs
      .readdirSync(`./Events/${dir}/`)
      .filter((file) => file.endsWith(".js"));
    files.forEach((file) => {
      require(`../Events/${dir}/${file}`);
      i = i + 1;
      table.addRow(i.toString() + ".", file.split(".js")[0], "» 🌱 «");
    });
  });
  console.log(chalk.white(table.toString()));
};
