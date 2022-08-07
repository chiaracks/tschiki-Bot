const client = require("../..");
const Levels = require("discord-xp");
const pogger = __importStar(require("pogger"));

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guildId) return;

  const xp = Math.floor(Math.random() * 7) + 1;
  const hasLeveledUp = await Levels.appendXp(
    message.author.id,
    message.guildId,
    xp
  );

  pogger.event(`[RANKING]: ${message.author.tag} recieved XP: ${xp}`);

  if (hasLeveledUp) {
    const user = await Levels.fetch(message.author.id, message.guildId);
    message.channel.send(
      `> :tada: ${message.author}, congratulations! You have leveled up to **${user.level}**.`
    );
  }
});
