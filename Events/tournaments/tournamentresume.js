const { EmbedBuilder, ChannelType, PermissionsBitField } = require("discord.js");
const client = require("../..");
const pogger = __importStar(require("pogger"));
const fs = require("fs");

client.on("ready", () => {
  function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  const stateRAW = fs.readFileSync("./structures/json/tournaments/state.json");
  let state = JSON.parse(stateRAW);

  if (state.currentState === true) {
    let currentGuild = client.guilds.cache.find((guild) => guild.id === process.env.GUILD_ID);
    if (currentGuild.channels.cache.find((channel) => channel.name === "🎯・team-1")) return;

    const statusRAW = fs.readFileSync("./structures/json/tournaments/status.json");
    let status = JSON.parse(statusRAW);

    pogger.info(`[TOURNAMENTS]: Status • Resumed`);
    var delayTime = status.timestamp - Date.now();

    delay(delayTime).then(async () => {
      let channel = await currentGuild.channels.cache.get(status.channelid);
      channel.messages.fetch(status.messageid).then((embedTournament) => {
        embedTournament.edit({ components: [] });

        var timestampEnd = status.timestampend;
        if (timestampEnd.toString().length < 13) {
          timestampEnd = timestampEnd * 1000;
        }
        var delayTimeEnd = timestampEnd - Date.now();
        delay(delayTimeEnd).then(async () => {
          const teamsEmbed = new EmbedBuilder().setTitle("<:GemBotV2:1005163752775241728> GemBot  ·  Tournament Teams <:GemBotV2:1005163752775241728>").setColor("#ffffff").setTimestamp();

          const teamsRAW = fs.readFileSync("./structures/json/tournaments/teams.json");
          let teams = JSON.parse(teamsRAW);
          var DescriptionString = "";
          for (let i = 0; i < status.teams; i++) {
            var currentTeam = teams[i + 1];
            DescriptionString = DescriptionString + `\n> ** 📪 TEAM ${i + 1}**\n---\n`;
            currentTeam.forEach((user) => {
              DescriptionString = DescriptionString + `<:iconreply:1005097394561634362> <@${user.playerId}>\n`;
            });
          }

          teamsEmbed.setDescription(DescriptionString);
          channel.send({ embeds: [teamsEmbed] });

          const categoryTournaments = currentGuild.channels.cache.find((channel) => channel.name === "━TOURNAMENTS━━━━━━");

          for (let i = 0; i < status.teams; i++) {
            var currentTeam = teams[i + 1];
            var teamVoice = await currentGuild.channels.create({
              name: `♨️・team ${i + 1}`,
              type: ChannelType.GuildText,
              parent: categoryTournaments,
              permissionOverwrites: [
                {
                  id: currentGuild.id,
                  deny: [PermissionsBitField.Flags.ViewChannel],
                },
              ],
            });
            teamVoice.setParent(categoryTournaments);
            currentTeam.forEach((userid) => {
              teamVoice.permissionOverwrites.create(userid.playerId, { ViewChannel: true, SendMessages: true });
            });
          }

          var teamVoice = await currentGuild.channels.create({
            name: `ιllιlı.ıl - lııl - lııl - lıιllιlı.`,
            type: ChannelType.GuildVoice,
            parent: categoryTournaments,
            permissionOverwrites: [
              {
                id: currentGuild.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
                deny: [PermissionsBitField.Flags.Connect],
              },
            ],
          });

          for (let i = 0; i < status.teams; i++) {
            var currentTeam = teams[i + 1];
            var teamVoice = await currentGuild.channels.create({
              name: `${i === 0 ? "╭" : i === status.teams - 1 ? "╰" : "┊"}📌・team ${i + 1}`,
              type: ChannelType.GuildVoice,
              parent: categoryTournaments,
              permissionOverwrites: [
                {
                  id: currentGuild.id,
                  allow: [PermissionsBitField.Flags.ViewChannel],
                  deny: [PermissionsBitField.Flags.Connect],
                },
              ],
            });
            teamVoice.setParent(categoryTournaments);
            currentTeam.forEach((userid) => {
              teamVoice.permissionOverwrites.create(userid.playerId, { ViewChannel: true, Connect: true });
            });
          }

          //DELETE DATA
          fs.unlink("./structures/json/tournaments/time.json", function (err) {
            if (err) throw err;
          });
          fs.unlink("./structures/json/tournaments/teams.json", function (err) {
            if (err) throw err;
          });
          const playerData = [];
          fs.writeFile("./structures/json/tournaments/applys.json", JSON.stringify(playerData), function (err) {
            if (err) throw err;
          });
          fs.unlink("./structures/json/tournaments/status.json", function (err) {
            if (err) throw err;
          });
          pogger.event("[TOURNAMENTS]: Tournament data deleted.");
        });
      });
    });
  }
});
