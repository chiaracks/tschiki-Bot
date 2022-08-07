const { ButtonInteraction, EmbedBuilder } = require('discord.js');
const client = require('../..');
const fs = require('fs');
const pogger = __importStar(require('pogger'));

/**
 *
 * @param {ButtonInteraction} interaction
 */

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  if (!interaction.customId.startsWith('team')) return;

  const teamNumber = interaction.customId.substring(5, 6);
  const playerId = interaction.customId.substring(7);

  const teamsRAW = fs.readFileSync('./structures/json/tournaments/teams.json');
  let teams = JSON.parse(teamsRAW);

  const statusRAW = fs.readFileSync('./structures/json/tournaments/status.json');
  let status = JSON.parse(statusRAW);

  for (let i = 0; i < status.teams; i++) {
    teams[i + 1].forEach((user) => {
      if (user.playerId === playerId) {
        interaction.reply({ content: '> ❗ The user is already in a team.' });
      }
    });
  }

  const oldTeamMembers = teams[teamNumber];
  if (oldTeamMembers.length >= 6) {
    var sendString = '> ❗ The team is already full.\n\n';
    for (let i = 0; i < status.teams; i++) {
      var currentMembers = teams[i + 1];
      var multiplier = 0;
      sendString = sendString + `<:iconreply:1005097394561634362> ${i + 1 === 1 ? '🥇' : i + 1 === 2 ? '🥈' : i + 1 === 3 ? '🥉' : '🏅'} **Team ${i + 1}:** ${currentMembers.length + multiplier} member(s).\n`;
      teams[i + 1].forEach((member) => {
        sendString = sendString + `\`\`\`css\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${member.playerName} ⠀${member.playerInfo.toString().replaceAll('>', '').replaceAll('*', '')}\`\`\`\n`;
      });
    }
    interaction.reply({
      embeds: [new EmbedBuilder().setColor('#ffffff').setDescription(sendString)],
      ephemeral: true
    });
  } else {
    var sendString = '> ♻️ Successfully added player to the team.\n\n';
    const newTeamMember = { playerInfo: interaction.message.embeds[0].description, playerName: interaction.message.embeds[0].author.name, playerId: playerId };
    teams[teamNumber] = [...oldTeamMembers, newTeamMember];
    fs.writeFile('./structures/json/tournaments/teams.json', JSON.stringify(teams), function (err) {
      if (err) throw err;

      pogger.event(`[TOURNAMENTS]: New member (${playerId}) applied to team ${teamNumber}.`);
    });

    for (let i = 0; i < status.teams; i++) {
      var currentMembers = teams[i + 1];
      var multiplier = 0;
      sendString = sendString + `<:iconreply:1005097394561634362> ${i + 1 === 1 ? '🥇' : i + 1 === 2 ? '🥈' : i + 1 === 3 ? '🥉' : '🏅'} **Team ${i + 1}:** ${currentMembers.length + multiplier} member(s).\n`;
      teams[i + 1].forEach((member) => {
        sendString = sendString + `\`\`\`css\n${member.playerName}\n\n${member.playerInfo.toString().replaceAll('>', '').replaceAll('*', '').replaceAll(' ', '')}\`\`\`\n`;
      });
    }

    interaction.reply({
      embeds: [new EmbedBuilder().setColor('#ffffff').setDescription(sendString)],
      ephemeral: true
    });
    interaction.message.edit({ components: [] });
  }
});
