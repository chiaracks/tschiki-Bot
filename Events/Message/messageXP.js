const client = require("../..");
const Levels = require("discord-xp");
const pogger = __importStar(require("pogger"));

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guildId) return;

  const xp = Math.floor(Math.random() * 7) + 1;
  const hasLeveledUp = await Levels.appendXp(message.author.id, message.guildId, xp);

  pogger.event(`[RANKING]: ${message.author.tag} recieved XP: ${xp}`);

  if (hasLeveledUp) {
    const user = await Levels.fetch(message.author.id, message.guildId);
    message.reply(`> :tada: ${message.author}, congratulations! You have leveled up to **Lvl. ${user.level}**.`);
    if (user.level === 5) message.member.roles.add(message.guild.roles.cache.find((r) => r.name === "Level・Ⅴ +"));
    if (user.level === 10) message.member.roles.add(message.guild.roles.cache.find((r) => r.name === "Level・Ⅹ +"));

    if (user.level === 15) message.member.roles.add(message.guild.roles.cache.find((r) => r.name === "Level・ⅩⅤ +"));
    if (user.level === 20) message.member.roles.add(message.guild.roles.cache.find((r) => r.name === "Level・ⅩⅩ +"));

    if (user.level === 25) message.member.roles.add(message.guild.roles.cache.find((r) => r.name === "Level・ⅩⅩⅤ +"));
    if (user.level === 30) message.member.roles.add(message.guild.roles.cache.find((r) => r.name === "Level・ⅩⅩⅩ +"));
  }
});
