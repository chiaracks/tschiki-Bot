const { CommandInteraction, Client, PermissionsBitField, EmbedBuilder, ButtonBuilder, ChannelType, ActionRowBuilder } = require("discord.js");
const fs = require("fs");
const pogger = __importStar(require("pogger"));

module.exports = {
  name: "tournament",
  description: "Server's tournaments.",
  userPerms: ["ManageMessages"],
  options: [
    {
      name: "start",
      description: "Start a new tournament.",
      type: "1",
      options: [
        {
          name: "apply-deadline",
          description: "Select the application deadline. ONLY UNIX TIMESTAMP - https://timestampgenerator.com/",
          type: "10",
          required: true,
        },
        {
          name: "tournament-start",
          description: "Select the tournament's start. ONLY UNIX TIMESTAMP - https://timestampgenerator.com/",
          type: "10",
          required: true,
        },
        {
          name: "teams",
          description: "Select the tournament's amount of teams.",
          type: "10",
          required: true,
        },
        {
          name: "title",
          description: "Title of the tournament.",
          type: "3",
          required: true,
        },
        {
          name: "description",
          description: "Describe the tournament.",
          type: "3",
          required: true,
        },
        {
          name: "prize",
          description: "Select a prize.",
          type: "3",
          required: true,
        },
      ],
    },
    {
      name: "stop",
      description: "Stop the running tournament.",
      type: "1",
    },
    {
      name: "ban",
      description: "Ban a member from the tournaments.",
      type: "1",
      options: [
        {
          name: "ban-user",
          description: "Select a user.",
          type: "6",
          required: true,
        },
      ],
    },
    {
      name: "unban",
      description: "Unban a member from the tournaments.",
      type: "1",
      options: [
        {
          name: "unban-user",
          description: "Select a user.",
          type: "6",
          required: true,
        },
      ],
    },
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

    if (interaction.options.getSubcommand() == "start") {
      let rawdata = fs.readFileSync("./structures/json/tournaments/state.json");
      let StateInfo = JSON.parse(rawdata);
      if (StateInfo.currentState === true) {
        await interaction.reply({
          content: `> 🚩 You can't run multiple tournaments at the same time.`,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: `> ♻️ Successfully started tournament.`,
          ephemeral: true,
        });

        const categoryTournaments = await interaction.member.guild.channels.create({
          name: "━TOURNAMENTS━━━━━━",
          type: ChannelType.GuildCategory,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              allow: [PermissionsBitField.Flags.ViewChannel],
              deny: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.Connect],
            },
          ],
        });
        const channel = await interaction.member.guild.channels.create({
          name: "📌・information",
          type: ChannelType.GuildText,
          parent: categoryTournaments,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              allow: [PermissionsBitField.Flags.ViewChannel],
              deny: [PermissionsBitField.Flags.SendMessages],
            },
          ],
        });

        const description = interaction.options.getString("description");
        const prize = interaction.options.getString("prize");

        var timestamp = interaction.options.getNumber("apply-deadline");
        var currentGuild = client.guilds.cache.find((guild) => guild.id === process.env.GUILD_ID);

        const tournamentEmbed = new EmbedBuilder()
          .setTitle(`<:GemBotV2:1005163752775241728> GemBot  ·  New Tournament: **${interaction.options.getString("title")}** <:GemBotV2:1005163752775241728>`)
          .setColor("#ffffff")
          .setDescription(
            `**[Will be livestreamed on twitch @archmeton](https://www.twitch.tv/archmeton/)**\n---\n${description}\n---\n<:iconreply:1005097394561634362> **Tournament start: **\n> 🎯 <t:${interaction.options.getNumber(
              "tournament-start"
            )}>\n\n<:iconreply:1005097394561634362> **Tournament Prize: **\n> 💎 ${prize}\n\n<:iconreply:1005097394561634362> **${interaction.options.getNumber(
              "teams"
            )} Teams consisting of:**\n> ***1.)*** 5 main players\n> ***2.)*** sub player in-case a main player drops out\n\n**<:iconreply:1005097394561634362> Rules:**
            > ***1.)*** You need to be in the Archmeton discord server
            > ***2.)*** **EU account** only (max 150 ping!)
            > ***3.)*** You **must be in the call at all times when playing**, communications might be recorded for video content
            > ***4.)*** You **might be interviewed in the day** after to ask about how you felt about a certain play (For the YouTube)
            > ***5.)*** You have to **be able to play all matches** (roughly 3 hours)
            > ***6.)*** **Unsportsmanlike behaviour, intentionally AFKing or trolling will result in a permanent ban** of all tournaments
            > ***7.)*** *Keep it fun!*\n---\n`
          )
          .addFields(
            {
              name: "· Apply deadline",
              value: `> ⌛ <t:${timestamp}>`,
              inline: false,
            },
            { name: "· Applies", value: `> 📜 00`, inline: false }
          )
          .setTimestamp()
          .setFooter({
            text: "Contact Jonas#1713 for help.",
            iconURL: currentGuild.iconURL({ dynamic: true }),
          });

        const buttons = new ActionRowBuilder();
        buttons.addComponents(new ButtonBuilder().setCustomId("tournament-apply").setLabel(`Sign-up for tournament`).setStyle("1").setEmoji(`📝`));

        channel
          .send({
            embeds: [tournamentEmbed],
            components: [buttons],
          })
          .then(async (embedSent) => {
            const objdata = {
              timestamp: timestamp,
              timestampend: interaction.options.getNumber("tournament-start"),
              channelid: channel.id,
              messageid: embedSent.id,
              prize: prize,
              teams: interaction.options.getNumber("teams"),
              description: description,
            };
            fs.writeFile("./structures/json/tournaments/status.json", JSON.stringify(objdata), function (err) {
              if (err) throw err;
            });

            const playerData = [];

            fs.writeFile("./structures/json/tournaments/applys.json", JSON.stringify(playerData), function (err) {
              if (err) throw err;
            });

            const teamsData = {};
            for (let i = 0; i < interaction.options.getNumber("teams"); i++) {
              teamsData[i + 1] = [];
            }

            fs.writeFile("./structures/json/tournaments/teams.json", JSON.stringify(teamsData), function (err) {
              if (err) throw err;
            });

            const timedata = {
              createdat: Date.now(),
              timestamp: timestamp,
            };
            fs.writeFile("./structures/json/tournaments/time.json", JSON.stringify(timedata), function (err) {
              if (err) throw err;
            });

            const state = {
              currentState: true,
            };
            fs.writeFile("./structures/json/tournaments/state.json", JSON.stringify(state), function (err) {
              if (err) throw err;
            });
            pogger.event("[TOURNAMENTS]: Created new tournament.");

            if (timestamp.toString().length < 13) {
              timestamp = timestamp * 1000;
            }

            var tournametStart = interaction.options.getNumber("tournament-start");
            if (tournametStart.toString().length < 13) {
              tournametStart = tournametStart * 1000;
            }
            var delayTime = timestamp - Date.now();
            delay(delayTime).then(async () => {
              embedSent.edit({ components: [] });

              const teamsEmbed = new EmbedBuilder().setTitle("<:GemBotV2:1005163752775241728> GemBot  ·  Tournament Teams <:GemBotV2:1005163752775241728>").setColor("#ffffff").setTimestamp();

              const teamsRAW = fs.readFileSync("./structures/json/tournaments/teams.json");
              let teams = JSON.parse(teamsRAW);
              var DescriptionString = "";
              for (let i = 0; i < interaction.options.getNumber("teams"); i++) {
                var currentTeam = teams[i + 1];
                DescriptionString = DescriptionString + `\n> ** 📪 TEAM ${i + 1}**\n---\n`;
                currentTeam.forEach((user) => {
                  DescriptionString = DescriptionString + `<:iconreply:1005097394561634362> <@${user.playerId}>\n`;
                });
              }

              teamsEmbed.setDescription(DescriptionString);
              channel.send({ embeds: [teamsEmbed] });

              for (let i = 0; i < interaction.options.getNumber("teams"); i++) {
                var currentTeam = teams[i + 1];
                var teamVoice = await interaction.member.guild.channels.create({
                  name: `🎯・team ${i + 1}`,
                  type: ChannelType.GuildText,
                  parent: categoryTournaments,
                  permissionOverwrites: [
                    {
                      id: interaction.guild.id,
                      deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                  ],
                });
                teamVoice.setParent(categoryTournaments);
                currentTeam.forEach((userid) => {
                  teamVoice.permissionOverwrites.create(userid.playerId, { ViewChannel: true, SendMessages: true });
                });

                let infoMessage = new EmbedBuilder()
                  .setTitle(`<:GemBotV2:1005163752775241728> Tournament  · **Team ${i + 1}** <:GemBotV2:1005163752775241728>`)
                  .setTimestamp()
                  .setColor("#ffffff").setDescription(`
                    **Congrats on being picked for the upcoming tournament!**
                    Remember that it starts in <t:${interaction.options.getNumber("tournament-start")}:R>, and you ***HAVE TO be in the call*** during the tournament, you are allowed to mute yourself.

                    > **💎 Prize is once again:**
                    ・ ${prize} , including sub (if main player does NOT play a single game, they wont get it!)
                    ・ The  role for the winners, so everyone will see you as a winner in the discord forever!

                    > **📜 What's Next? We you guys to come up with:** 
                    ・ A teamname (Nothing NSFW/Offensive)
                    ・ A fitting profile picture (Memey or serious, your call!)
                    ・ The team captain to make sure he has all members added, so he can invite them during the tournament

                    So... say hello to each other, maybe even create a nice strat and prepare yourself!
                    `);

                await teamVoice.send({ embeds: [infoMessage], content: `${currentTeam.forEach((userid) => `${currentTeam[0] && "|"} <@${userid}> |`)}` });
              }

              var teamVoice = await interaction.member.guild.channels.create({
                name: `ιllιlı.ıl - lııl - lııl - lıιllιlı.`,
                type: ChannelType.GuildVoice,
                parent: categoryTournaments,
                permissionOverwrites: [
                  {
                    id: interaction.guild.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                    deny: [PermissionsBitField.Flags.Connect],
                  },
                ],
              });

              for (let i = 0; i < interaction.options.getNumber("teams"); i++) {
                var currentTeam = teams[i + 1];
                var teamVoice = await interaction.member.guild.channels.create({
                  name: `${i === 0 ? "╭" : i === interaction.options.getNumber("teams") - 1 ? "╰" : "┊"}📌・team ${i + 1}`,
                  type: ChannelType.GuildVoice,
                  parent: categoryTournaments,
                  permissionOverwrites: [
                    {
                      id: interaction.guild.id,
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
                if (err) pogger.info("[TOURNAMENTS] FILE ALREADY DELETED.");
              });
              fs.unlink("./structures/json/tournaments/teams.json", function (err) {
                if (err) pogger.info("[TOURNAMENTS] FILE ALREADY DELETED.");
              });
              const playerData = [];
              fs.writeFile("./structures/json/tournaments/applys.json", JSON.stringify(playerData), function (err) {
                if (err) pogger.info("[TOURNAMENTS] FILE ALREADY DELETED.");
              });
              fs.unlink("./structures/json/tournaments/status.json", function (err) {
                if (err) pogger.info("[TOURNAMENTS] FILE ALREADY DELETED.");
              });
              pogger.event("[TOURNAMENTS]: Tournament data deleted.");
            });
          });
      }
    } else if (interaction.options.getSubcommand() == "stop") {
      let rawdata = fs.readFileSync("./structures/json/tournaments/state.json");
      let StateInfo = JSON.parse(rawdata);
      console.log(StateInfo.currentState);

      if (StateInfo.currentState == true) {
        await interaction.reply({
          content: `> 🚩 Tournament stopped.`,
          ephemeral: true,
        });
      }

      const tournamentCategory = interaction.guild.channels.cache.find((channel) => channel.name === "━TOURNAMENTS━━━━━━");
      if (tournamentCategory) {
        while (interaction.guild.channels.cache.find((channel) => channel.name.includes("team"))) {
          var channel = interaction.guild.channels.cache.find((channel) => channel.name.includes("team"));
          await channel.delete("Tournament stop");
        }

        const informationChannel = interaction.guild.channels.cache.find((channel) => channel.name === "📌・information");
        const utilChannel = interaction.guild.channels.cache.find((channel) => channel.name === "ιllιlı.ıl - lııl - lııl - lıιllιlı.");

        await utilChannel.delete("Tournament Stop");
        await informationChannel.delete("Tournament stop");
        await tournamentCategory.delete("Tournament stop");
      }
      if (StateInfo.currentState === false) {
        interaction.reply({
          content: `> 🚩 There is no tounament at the moment.`,
          ephemeral: true,
        });
      } else {
        //DELETE DATA
        const state = {
          currentState: false,
        };
        fs.writeFile("./structures/json/tournaments/state.json", JSON.stringify(state), function (err) {
          if (err) throw err;
        });

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
      }
    } else if (interaction.options.getSubcommand() == "ban") {
      await interaction.reply({
        content: "> ❗ Banned user successfully.",
        ephemeral: true,
      });
      let rawdata = fs.readFileSync("./structures/json/tournaments/banned.json");
      let bannedPlayers = JSON.parse(rawdata);
      var banuser = interaction.options.getMember("ban-user");
      const newBannedPlayers = [...bannedPlayers, banuser.user.id];
      fs.writeFile("./structures/json/tournaments/banned.json", JSON.stringify(newBannedPlayers), function (err) {
        if (err) throw err;

        pogger.event("[TOURNAMENTS]: Changed banned players.");
      });
    } else if (interaction.options.getSubcommand() == "unban") {
      await interaction.reply({
        content: "> ❗ Unbanned user successfully.",
        ephemeral: true,
      });
      let rawdata = fs.readFileSync("./structures/json/tournaments/banned.json");
      let bannedPlayers = JSON.parse(rawdata);
      var unbanuser = interaction.options.getMember("unban-user");

      var newBannedUserList = [];
      bannedPlayers.forEach((banneduser) => {
        if (banneduser == unbanuser.user.id) {
          return;
        } else {
          newBannedUserList.push(banneduser);
        }
      });

      fs.writeFile("./structures/json/tournaments/banned.json", JSON.stringify(newBannedUserList), function (err) {
        if (err) throw err;

        pogger.event("[TOURNAMENTS]: Changed banned players.");
      });
    }
  },
};
