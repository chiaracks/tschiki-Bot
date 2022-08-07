const { CommandInteraction, Client, PermissionsBitField, EmbedBuilder, ButtonBuilder, ChannelType, ActionRowBuilder } = require('discord.js');
const fs = require('fs');
const pogger = __importStar(require('pogger'));

module.exports = {
  name: 'tournament',
  description: "Server's tournaments.",
  userPerms: ['ManageMessages'],
  options: [
    {
      name: 'start',
      description: 'Start a new tournament.',
      type: '1',
      options: [
        {
          name: 'apply-deadline',
          description: 'Select the application deadline. ONLY UNIX TIMESTAMP - https://timestampgenerator.com/',
          type: '10',
          required: true
        },
        {
          name: 'tournament-start',
          description: "Select the tournament's start. ONLY UNIX TIMESTAMP - https://timestampgenerator.com/",
          type: '10',
          required: true
        },
        {
          name: 'teams',
          description: "Select the tournament's amount of teams.",
          type: '10',
          required: true
        },
        {
          name: 'description',
          description: 'Describe the tournament.',
          type: '3',
          required: true
        },
        {
          name: 'prize',
          description: 'Select a prize.',
          type: '3',
          required: true
        }
      ]
    },
    {
      name: 'stop',
      description: 'Stop the running tournament.',
      type: '1'
    },
    {
      name: 'ban',
      description: 'Ban a member from the tournaments.',
      type: '1',
      options: [
        {
          name: 'ban-user',
          description: 'Select a user.',
          type: '6',
          required: true
        }
      ]
    },
    {
      name: 'unban',
      description: 'Unban a member from the tournaments.',
      type: '1',
      options: [
        {
          name: 'unban-user',
          description: 'Select a user.',
          type: '6',
          required: true
        }
      ]
    }
  ],
  /**
   *
   *  @param {CommandInteraction} interaction
   *  @param {Client} client
   */

  run: async (client, interaction) => {
    function delay(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }

    if (interaction.options.getSubcommand() == 'start') {
      let rawdata = fs.readFileSync('./structures/json/tournaments/state.json');
      let StateInfo = JSON.parse(rawdata);
      if (StateInfo.currentState === true) {
        await interaction.reply({
          content: `> 🚩 You can't run multiple tournaments at the same time.`,
          ephemeral: true
        });
      } else {
        await interaction.reply({
          content: `> ♻️ Successfully started tournament.`,
          ephemeral: true
        });

        const categoryTournaments = await interaction.member.guild.channels.create({
          name: '━TOURNAMENTS━━━━━━',
          type: ChannelType.GuildCategory,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              allow: [PermissionsBitField.Flags.ViewChannel],
              deny: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.Connect]
            }
          ]
        });
        const channel = await interaction.member.guild.channels.create({
          name: '📌・information',
          type: ChannelType.GuildText,
          parent: categoryTournaments,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              allow: [PermissionsBitField.Flags.ViewChannel],
              deny: [PermissionsBitField.Flags.SendMessages]
            }
          ]
        });

        const description = interaction.options.getString('description');
        const prize = interaction.options.getString('prize');

        var timestamp = interaction.options.getNumber('apply-deadline');
        var currentGuild = client.guilds.cache.find((guild) => guild.id === process.env.GUILD_ID);

        const tournamentEmbed = new EmbedBuilder()
          .setTitle('<:GemBotV2:1005163752775241728> GemBot  ·  New Tournament <:GemBotV2:1005163752775241728>')
          .setColor('#ffffff')
          .setDescription(
            `${description}\n---\nLive at: https://www.twitch.tv/archmeton/ \n\n<:iconreply:1005097394561634362> **${interaction.options.getNumber(
              'teams'
            )} Teams consisting of:**\n> ***1.)*** 5 main players\n> ***2.)*** sub player in-case a main player drops out\n\n**<:iconreply:1005097394561634362> Rules:**
            > ***1.)*** You need to be in the Archmeton discord server
            > ***2.)*** **EU account** only (max 150 ping!)
            > ***4.)*** **Neon, Chamber and Jett are not allowed** to be picked
            > ***5.)*** You **must be in the call at all times when playing**, communications will be recorded for video content
            > ***6.)*** You **might be interviewed in the day** after to ask about how you felt about a certain play (For the YouTube)
            > ***7.)*** You have to **be able to play all matches** (roughly 3 hours)
            > ***8.)*** **Unsportsmanlike behaviour, intentionally AFKing or trolling will result in a permanent ban** of all tournaments
            > ***9.)*** *Keep it fun!*\n---\n`
          )
          .addFields(
            {
              name: '· Tournament Start',
              value: `> 🏁 <t:${interaction.options.getNumber('tournament-start')}>`,
              inline: false
            },
            {
              name: '· Deadline',
              value: `> ⌛ <t:${timestamp}>`,
              inline: false
            },
            { name: '· Prize', value: `> 💰 ${prize}`, inline: false },
            { name: '· Applys', value: `> 📜 00`, inline: false }
          )
          .setTimestamp()
          .setFooter({
            text: 'Contact Jonas#1713 for help.',
            iconURL: currentGuild.iconURL({ dynamic: true })
          });

        const buttons = new ActionRowBuilder();
        buttons.addComponents(new ButtonBuilder().setCustomId('tournament-apply').setLabel(`Sign-up for tournament`).setStyle('1').setEmoji(`📝`));

        channel
          .send({
            embeds: [tournamentEmbed],
            components: [buttons]
          })
          .then(async (embedSent) => {
            const objdata = {
              timestamp: timestamp,
              timestampend: interaction.options.getNumber('tournament-start'),
              channelid: channel.id,
              messageid: embedSent.id,
              prize: prize,
              teams: interaction.options.getNumber('teams'),
              description: description
            };
            fs.writeFile('./structures/json/tournaments/status.json', JSON.stringify(objdata), function (err) {
              if (err) throw err;
            });

            const playerData = [];

            fs.writeFile('./structures/json/tournaments/applys.json', JSON.stringify(playerData), function (err) {
              if (err) throw err;
            });

            const teamsData = {};
            for (let i = 0; i < interaction.options.getNumber('teams'); i++) {
              teamsData[i + 1] = [];
            }

            fs.writeFile('./structures/json/tournaments/teams.json', JSON.stringify(teamsData), function (err) {
              if (err) throw err;
            });

            const timedata = {
              createdat: Date.now(),
              timestamp: timestamp
            };
            fs.writeFile('./structures/json/tournaments/time.json', JSON.stringify(timedata), function (err) {
              if (err) throw err;
            });

            const state = {
              currentState: true
            };
            fs.writeFile('./structures/json/tournaments/state.json', JSON.stringify(state), function (err) {
              if (err) throw err;
            });
            pogger.event('[TOURNAMENTS]: Created new tournament.');

            if (timestamp.toString().length < 13) {
              timestamp = timestamp * 1000;
            }

            var tournametStart = interaction.options.getNumber('tournament-start');
            if (tournametStart.toString().length < 13) {
              tournametStart = tournametStart * 1000;
            }
            var delayTime = timestamp - Date.now();
            delay(delayTime).then(async () => {
              embedSent.edit({ components: [] });

              var delayTimeEnd = tournametStart - Date.now();
              delay(delayTimeEnd).then(async () => {
                const teamsEmbed = new EmbedBuilder().setTitle('<:GemBotV2:1005163752775241728> GemBot  ·  Tournament Teams <:GemBotV2:1005163752775241728>').setColor('#ffffff').setTimestamp();

                const teamsRAW = fs.readFileSync('./structures/json/tournaments/teams.json');
                let teams = JSON.parse(teamsRAW);
                var DescriptionString = '';
                for (let i = 0; i < interaction.options.getNumber('teams'); i++) {
                  var currentTeam = teams[i + 1];
                  DescriptionString = DescriptionString + `\n> ** 📪 TEAM ${i + 1}**\n`;
                  currentTeam.forEach((user) => {
                    DescriptionString = DescriptionString + `<:iconreply:1005097394561634362> <@${user.playerId}>\n`;
                  });
                }

                teamsEmbed.setDescription(DescriptionString);
                channel.send({ embeds: [teamsEmbed] });

                for (let i = 0; i < interaction.options.getNumber('teams'); i++) {
                  var currentTeam = teams[i + 1];
                  var teamVoice = await interaction.member.guild.channels.create({
                    name: `${i === 0 ? '╭' : i === interaction.options.getNumber('teams') - 1 ? '╰' : '┊'}📌・team ${i + 1}`,
                    type: ChannelType.GuildVoice,
                    parent: categoryTournaments,
                    permissionOverwrites: [
                      {
                        id: interaction.guild.id,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                        deny: [PermissionsBitField.Flags.Connect]
                      }
                    ]
                  });
                  teamVoice.setParent(categoryTournaments);
                  currentTeam.forEach((userid) => {
                    teamVoice.permissionOverwrites.create(userid.playerId, { ViewChannel: true, Connect: true });
                  });
                }

                //DELETE DATA
                const state = {
                  currentState: false
                };
                fs.writeFile('./structures/json/tournaments/state.json', JSON.stringify(state), function (err) {
                  if (err) throw err;
                });

                fs.unlink('./structures/json/tournaments/time.json', function (err) {
                  if (err) throw err;
                });
                fs.unlink('./structures/json/tournaments/teams.json', function (err) {
                  if (err) throw err;
                });
                const playerData = [];
                fs.writeFile('./structures/json/tournaments/applys.json', JSON.stringify(playerData), function (err) {
                  if (err) throw err;
                });
                fs.unlink('./structures/json/tournaments/status.json', function (err) {
                  if (err) throw err;
                });
                pogger.event('[TOURNAMENTS]: Tournament data deleted.');
              });
            });
          });
      }
    } else if (interaction.options.getSubcommand() == 'stop') {
      const tournamentCategory = await interaction.guild.channels.cache.find((channel) => channel.name === '━TOURNAMENTS━━━━━━');
      if (tournamentCategory) {
        while (interaction.guild.channels.cache.find((channel) => channel.name.includes('team'))) {
          var channel = await interaction.guild.channels.cache.find((channel) => channel.name.includes('team'));
          await channel.delete('Tournament stop');
        }

        const informationChannel = await interaction.guild.channels.cache.find((channel) => channel.name === '📌・information');
        await informationChannel.delete('Tournament stop');
        await tournamentCategory.delete('Tournament stop');
      }
      let rawdata = fs.readFileSync('./structures/json/tournaments/state.json');
      let StateInfo = JSON.parse(rawdata);
      if (StateInfo.currentState === false) {
        interaction.reply({
          content: `> 🚩 There is no tounament at the moment.`,
          ephemeral: true
        });
      } else {
        interaction.reply({
          content: `> 🚩 Tournament stopped.`,
          ephemeral: true
        });

        //DELETE DATA
        const state = {
          currentState: false
        };
        fs.writeFile('./structures/json/tournaments/state.json', JSON.stringify(state), function (err) {
          if (err) throw err;
        });

        fs.unlink('./structures/json/tournaments/time.json', function (err) {
          if (err) throw err;
        });
        fs.unlink('./structures/json/tournaments/teams.json', function (err) {
          if (err) throw err;
        });
        const playerData = [];
        fs.writeFile('./structures/json/tournaments/applys.json', JSON.stringify(playerData), function (err) {
          if (err) throw err;
        });
        fs.unlink('./structures/json/tournaments/status.json', function (err) {
          if (err) throw err;
        });
        pogger.event('[TOURNAMENTS]: Tournament data deleted.');
      }
    } else if (interaction.options.getSubcommand() == 'ban') {
      await interaction.reply({
        content: '> ❗ Banned user successfully.',
        ephemeral: true
      });
      let rawdata = fs.readFileSync('./structures/json/tournaments/banned.json');
      let bannedPlayers = JSON.parse(rawdata);
      var banuser = interaction.options.getMember('ban-user');
      const newBannedPlayers = [...bannedPlayers, banuser.user.id];
      fs.writeFile('./structures/json/tournaments/banned.json', JSON.stringify(newBannedPlayers), function (err) {
        if (err) throw err;

        pogger.event('[TOURNAMENTS]: Changed banned players.');
      });
    } else if (interaction.options.getSubcommand() == 'unban') {
      await interaction.reply({
        content: '> ❗ Unbanned user successfully.',
        ephemeral: true
      });
      let rawdata = fs.readFileSync('./structures/json/tournaments/banned.json');
      let bannedPlayers = JSON.parse(rawdata);
      var unbanuser = interaction.options.getMember('unban-user');

      var newBannedUserList = [];
      bannedPlayers.forEach((banneduser) => {
        if (banneduser == unbanuser.user.id) {
          return;
        } else {
          newBannedUserList.push(banneduser);
        }
      });

      fs.writeFile('./structures/json/tournaments/banned.json', JSON.stringify(newBannedUserList), function (err) {
        if (err) throw err;

        pogger.event('[TOURNAMENTS]: Changed banned players.');
      });
    }
  }
};
