const client = require("../..");
const mongoose = require("mongoose");
const pogger = __importStar(require("pogger"));

client.on("ready", async () => {
  const activities = [
    { name: `${client.guilds.cache.size} Servers`, type: 2 }, // LISTENING
    { name: `${client.channels.cache.size} Channels`, type: 0 }, // PLAYING
    { name: `${client.users.cache.size} Users`, type: 3 }, // WATCHING
    { name: `Discord.js v14`, type: 5 }, // COMPETING
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
        pogger.info(`[CLIENT]: Mongo Database • Connected`);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //Setup Discord-Together
  const { DiscordTogether } = require("discord-together");
  client.discordTogether = new DiscordTogether(client);

  //Setup XP
  const Levels = require("discord-xp");
  Levels.setURL(Database);

  //Setup Music Player
  const { Player } = require("../../structures/functions/discord-music-player/dist/Player");
  const player = new Player(client, {
    leaveOnEmpty: false,
  });
  client.player = player;

  var queue = client.player.createQueue(process.env.GUILD_ID);
  const currentGuild = client.guilds.cache.get(process.env.GUILD_ID);
  const voiceChannelMusic = currentGuild.channels.cache.get(process.env.MUSICCHANNEL);
  await queue.join(voiceChannelMusic);

  pogger.info(`[CLIENT]: Status • Online`);
});
