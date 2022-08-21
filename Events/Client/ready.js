const client = require("../..");
const mongoose = require("mongoose");
const chalk = require("chalk");

client.on("ready", async () => {
  const currentGuild = client.guilds.cache.get(process.env.GUILD_ID);
  const logChannel = currentGuild.channels.cache.find((c) => c.id === process.env.LOGCHANNEL);

  logChannel.bulkDelete(100, true);

  const activities = [
    { name: `${client.channels.cache.size} Channels`, type: 0 },
    { name: `tschiki`, type: 2 },
    { name: `${client.users.cache.size} Users`, type: 3 },
    { name: `Discord.js v14`, type: 5 },
  ];
  const status = ["online", "dnd", "idle"];
  let i = 0;
  setInterval(() => {
    if (i >= activities.length) i = 0;
    client.user.setActivity(activities[i]);
    i++;
  }, 5000);

  let s = 0;
  setInterval(() => {
    if (s >= activities.length) s = 0;
    client.user.setStatus(status[s]);
    s++;
  }, 30000);
  const Database = process.env.MONGO_DB;

  if (Database) {
    mongoose
      .connect(Database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log(chalk.grey(new Date().toLocaleTimeString()), "🐳 [CLIENT]: Mongo Database • Connected")
        pogger.info(`[CLIENT]: Mongo Database • Connected`);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  console.log(chalk.grey(new Date().toLocaleTimeString()), "🐳 [CLIENT]: Status • Online")
});
