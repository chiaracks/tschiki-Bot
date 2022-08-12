const client = require("../..");
const pogger = __importStar(require("pogger"));
const fs = require("fs");
const { InteractionType, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");

client.on("interactionCreate", async (interaction) => {
  if (interaction.type !== InteractionType.ModalSubmit) return;
  if (interaction.customId === "applyModal") {
    let rawdatabanned = fs.readFileSync("./structures/json/tournaments/banned.json");
    let bannedUserList = JSON.parse(rawdatabanned);
    bannedUserList.forEach((m) => {
      if (m == interaction.member.id) {
        interaction.reply({
          content: "> ❗ You can't apply for the tournament because you are banned!",
          ephemeral: true,
        });
      } else {
        return;
      }
    });

    let rawdata = fs.readFileSync("./structures/json/tournaments/applys.json");
    let applys = JSON.parse(rawdata);
    var status = true;

    const applysArray = Object.values(applys);
    applysArray.forEach((memid) => {
      if (memid === interaction.member.id) {
        status = false;
        interaction.reply({
          content: "> ❗ You can't apply for the tournament twice!",
          ephemeral: true,
        });
      }
    });

    if (status === false) return;
    if (!interaction.fields.getTextInputValue("riotID").includes("#")) {
      interaction.reply({
        content: "> ❗ Invalid RiotID!",
        ephemeral: true,
      });
    } else {
      if (interaction.fields.getTextInputValue("substitute").toLowerCase() === "yes" || interaction.fields.getTextInputValue("substitute").toLowerCase() === "no") {
        if (interaction.fields.getTextInputValue("fluentEnglish").toLowerCase() === "yes" || interaction.fields.getTextInputValue("fluentEnglish").toLowerCase() === "no") {
          if (["iron", "bronze", "silver", "gold", "platinum", "diamond", "ascendant", "immortal", "radiant"].includes(interaction.fields.getTextInputValue("rankInput").toLowerCase())) {
            interaction.reply({
              content: "> ♻️ Thank you for your application!",
              ephemeral: true,
            });
            let rawdata = fs.readFileSync("./structures/json/tournaments/applys.json");
            let applys = JSON.parse(rawdata);

            const applysArray = Object.values(applys);
            const playerArray = [...applysArray, interaction.member.id];
            fs.writeFile("./structures/json/tournaments/applys.json", JSON.stringify(playerArray), function (err) {
              if (err) throw err;

              pogger.event("[TOURNAMENTS]: New member applied.");
            });
            const Embed = interaction.message.embeds[0];
            if (!Embed) return;

            var totalApplys = parseInt(Embed.fields[1].value.substring(4));
            totalApplys = totalApplys + 1;
            Embed.fields[1] = {
              name: "· Applys",
              value: `> 📜 ${totalApplys < 10 ? "0" + totalApplys.toString() : totalApplys}`,
              inline: true,
            };
            await interaction.message.edit({ embeds: [Embed] });

            const playerLog = new EmbedBuilder()
              .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
              })
              .setTimestamp()
              .setDescription(
                `> **RiotID**: ${interaction.fields.getTextInputValue("riotID")}
          > **Rank**: ${interaction.fields.getTextInputValue("rankInput")}
          > **Substitute**: ${interaction.fields.getTextInputValue("substitute")}
          > **Fluent english**: ${interaction.fields.getTextInputValue("fluentEnglish")}`
              )
              .setColor("#ffffff")
              .setTimestamp();

            const teamsizeRAW = fs.readFileSync("./structures/json/tournaments/status.json");
            let teamSize = JSON.parse(teamsizeRAW);
            const buttons = new ActionRowBuilder();

            for (let i = 0; i < teamSize.teams; i++) {
              buttons.addComponents(
                new ButtonBuilder()
                  .setCustomId(`team-${i + 1}-${interaction.user.id}`)
                  .setLabel(`Team ${i + 1}`)
                  .setStyle("1")
              );
            }

            let logChannel = interaction.guild.channels.cache.get(process.env.LOGCHANNEL);
            await logChannel.send({ embeds: [playerLog], components: [buttons] });
          } else {
            interaction.reply({
              content: `> ❗ Invalid field input. \"${interaction.fields.getTextInputValue("rankInput")}\" is not a rank.`,
              ephemeral: true,
            });
          }
        } else {
          interaction.reply({
            content: "> ❗ Invalid field input. Please respond field `4` with Yes/No",
            ephemeral: true,
          });
        }
      } else {
        interaction.reply({
          content: "> ❗ Invalid field input. Please respond field `3` with Yes/No",
          ephemeral: true,
        });
      }
    }
  }
});
