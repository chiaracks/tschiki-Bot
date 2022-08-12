const client = require("../..");
const pogger = __importStar(require("pogger"));

client.on("guildMemberAdd", async (member) => {
  member.roles.add(member.guild.roles.cache.find((r) => r.name === "Level・Ⅰ +"));
  pogger.info(`[SERVER] New member (${member.user.tag} joined the server.)`);
});
