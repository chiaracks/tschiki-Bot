const { EmbedBuilder, WebhookClient } = require("discord.js");
const { inspect } = require("util");
const chalk = require("chalk");

const webhook = new WebhookClient({
  url: process.env.DEVLOG_WEBHOOK
});

module.exports = (client) => {
  const embed = new EmbedBuilder();
  client.on("error", (err) => {
    console.log(chalk.grey(new Date().toLocaleTimeString()), `🌚[CLIENT] ${err}`);

    embed
      .setTitle("Discord API Error")
      .setURL("https://discordjs.guide/popular-topics/errors.html#api-errors")
      .setColor("#ffffff")
      .setDescription(`\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``)
      .setTimestamp();

    return webhook.send({ embeds: [embed] });
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.log(chalk.grey(new Date().toLocaleTimeString()),`🌚[CLIENT] ${reason} \n ${promise}`);

    embed
      .setTitle("**Unhandled Rejection/Catch**")
      .setURL("https://nodejs.org/api/process.html#event-unhandledrejection")
      .setColor("#ffffff")
      .addFields(
        {
          name: "Reason",
          value: `\`\`\`${inspect(reason, { depth: 0 }).slice(0, 1000)}\`\`\``
        },
        {
          name: "Promise",
          value: `\`\`\`${inspect(promise, { depth: 0 }).slice(0, 1000)}\`\`\``
        }
      )
      .setTimestamp();

    return webhook.send({ embeds: [embed] });
  });

  process.on("uncaughtException", (err, origin) => {
    console.log(chalk.grey(new Date().toLocaleTimeString()),`🌚[CLIENT] ${err} \n ${origin}`);

    embed
      .setTitle("**Uncaught Exception/Catch**")
      .setColor("#ffffff")
      .setURL("https://nodejs.org/api/process.html#event-uncaughtexception")
      .addFields(
        {
          name: "Error",
          value: `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``
        },
        {
          name: "Origin",
          value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\``
        }
      )
      .setTimestamp();

    return webhook.send({ embeds: [embed] });
  });

  process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log(chalk.grey(new Date().toLocaleTimeString()), `🌚[CLIENT] ${err} \n ${origin}`);

    embed
      .setTitle("**Uncaught Exception Monitor**")
      .setColor("#ffffff")
      .setURL("https://nodejs.org/api/process.html#event-uncaughtexceptionmonitor")
      .addFields(
        {
          name: "Error",
          value: `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``
        },
        {
          name: "Origin",
          value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\``
        }
      )
      .setTimestamp();

    return webhook.send({ embeds: [embed] });
  });

  process.on("warning", (warn) => {
    console.log(chalk.grey(new Date().toLocaleTimeString()), `🌚[CLIENT] ${warn}`);

    embed
      .setTitle("**Uncaught Exception Monitor Warning**")
      .setColor("#ffffff")
      .setURL("https://nodejs.org/api/process.html#event-warning")
      .addFields({
        name: "Warning",
        value: `\`\`\`${inspect(warn, { depth: 0 }).slice(0, 1000)}\`\`\``
      })
      .setTimestamp();

    return webhook.send({ embeds: [embed] });
  });
};
