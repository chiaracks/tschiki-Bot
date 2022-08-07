const { ApplicationCommandType, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const pogger = __importStar(require("pogger"));

module.exports = {
  name: "reactionroles",
  description: "Create reaction roles.",
  type: ApplicationCommandType.ChatInput,
  cooldown: 3000,
  userPerms: ["ManageMessages"],
  options: [
    {
      name: "create",
      description: "Create a new reactionrole panel.",
      type: "1",
      options: [
        {
          name: "panel",
          description: "Select the panel name.",
          type: "3",
          required: true,
          choices: [
            {
              name: "Agentroles",
              value: "Agentroles",
            },
            {
              name: "Verificationrole",
              value: "Verificationrole",
            },
            {
              name: "Notificationroles",
              value: "Notificationroles",
            },
          ],
        },
      ],
    },
    {
      name: "setup",
      description: "Setup an existing reactionrole panel.",
      type: "1",
      options: [
        {
          name: "panel-name",
          description: "Setup an existing reactionrole panel.",
          type: "3",
          required: true,
          choices: [
            {
              name: "Agentroles",
              value: "Agentroles",
            },
            {
              name: "Verificationrole",
              value: "Verificationrole",
            },
            {
              name: "Notificationroles",
              value: "Notificationroles",
            },
          ],
        },
        {
          name: "message-id",
          description: "Select the message id of the message.",
          type: "10",
          required: true,
        },
        {
          name: "channel",
          description: "Select the channel of the message.",
          type: "7",
          required: true,
        },
      ],
    },
  ],

  run: async (client, interaction) => {
    if (interaction.options.getSubcommand("setup")) {
      const PanelChoice = interaction.options.getString("setup");
      const channel = interaction.options.getChannel("channel");
      switch (PanelChoice) {
        case "Agentroles":
          interaction.reply({
            content: "> ♻️ Successfully set up new reaction role.",
          });
          var objdata = {
            messageid: interaction.options.getNumber("message-id"),
            channelid: channel.id,
          };
          fs.writeFile(
            "./structures/json/reactionroles/agents.json",
            JSON.stringify(objdata),
            function (err) {
              if (err) throw err;

              pogger.event("[ReactionRoles]: Setup new agent role embed.");
            }
          );
          break;
        case "Verificationrole":
          interaction.reply({
            content: "> ♻️ Successfully set up new reaction role.",
          });
          var objdata = {
            messageid: interaction.options.getNumber("message-id"),
            channelid: channel.id,
          };
          fs.writeFile(
            "./structures/json/reactionroles/verify.json",
            JSON.stringify(objdata),
            function (err) {
              if (err) throw err;

              pogger.event("[ReactionRoles]: Setup new verify role embed.");
            }
          );
          break;
        case "Notificationroles":
          interaction.reply({
            content: "> ♻️ Successfully set up new reaction role.",
          });
          var objdata = {
            messageid: interaction.options.getNumber("message-id"),
            channelid: channel.id,
          };
          fs.writeFile(
            "./structures/json/reactionroles/notifications.json",
            JSON.stringify(objdata),
            function (err) {
              if (err) throw err;

              pogger.event("[ReactionRoles]: Setup new notify role embed.");
            }
          );
          break;
      }
    } else if (interaction.options.getSubcommand("create")) {
      const PanelChoice = interaction.options.getString("panel");
      switch (PanelChoice) {
        case "Agentroles":
          const AgentRolesEmbed = new EmbedBuilder()
            .setTitle(
              "<:GemBotV2:1005081342121353246> GemBot  ·  Agent roles <:GemBotV2:1005081342121353246>"
            )
            .setDescription(
              "> Choose your main to showcase the world you know everything about them!"
            )
            .setColor("#ffffff");
          await interaction.reply({
            content:
              "> <a:discord:1002374117904883812> Reaction role embed successfully sent.",
            ephemeral: true,
          });
          await interaction.channel
            .send({ embeds: [AgentRolesEmbed] })
            .then((message) => {
              let guild = client.guilds.cache.find(
                (guild) => guild.id === "998972221198434354"
              );
              Promise.all([
                message.react(
                  guild.emojis.cache.find(
                    (emoji) => emoji.name === "AgentAstra"
                  )
                ),
                message.react(
                  guild.emojis.cache.find(
                    (emoji) => emoji.name === "AgentCypher"
                  )
                ),
                message.react(
                  guild.emojis.cache.find((emoji) => emoji.name === "AgentFade")
                ),
                message.react(
                  guild.emojis.cache.find(
                    (emoji) => emoji.name === "AgentChamber"
                  )
                ),
                message.react(
                  guild.emojis.cache.find((emoji) => emoji.name === "AgentRaze")
                ),
                message.react(
                  guild.emojis.cache.find(
                    (emoji) => emoji.name === "AgentBreach"
                  )
                ),
                message.react(
                  guild.emojis.cache.find(
                    (emoji) => emoji.name === "AgentBrimstone"
                  )
                ),
                message.react(
                  guild.emojis.cache.find((emoji) => emoji.name === "AgentSova")
                ),
                message.react(
                  guild.emojis.cache.find((emoji) => emoji.name === "AgentJett")
                ),
                message.react(
                  guild.emojis.cache.find((emoji) => emoji.name === "AgentKayo")
                ),
                message.react(
                  guild.emojis.cache.find(
                    (emoji) => emoji.name === "AgentKilljoy"
                  )
                ),
                message.react(
                  guild.emojis.cache.find((emoji) => emoji.name === "AgentNeon")
                ),
                message.react(
                  guild.emojis.cache.find((emoji) => emoji.name === "AgentOmen")
                ),
                message.react(
                  guild.emojis.cache.find(
                    (emoji) => emoji.name === "AgentPhoenix"
                  )
                ),
                message.react(
                  guild.emojis.cache.find(
                    (emoji) => emoji.name === "AgentReyna"
                  )
                ),
                message.react(
                  guild.emojis.cache.find((emoji) => emoji.name === "AgentSage")
                ),
                message.react(
                  guild.emojis.cache.find((emoji) => emoji.name === "AgentSkye")
                ),
                message.react(
                  guild.emojis.cache.find(
                    (emoji) => emoji.name === "AgentViper"
                  )
                ),
                message.react(
                  guild.emojis.cache.find((emoji) => emoji.name === "AgentYoru")
                ),
              ]);

              const objdata = {
                messageid: message.id,
                channelid: message.channelId,
              };
              fs.writeFile(
                "./structures/json/reactionroles/agents.json",
                JSON.stringify(objdata),
                function (err) {
                  if (err) throw err;

                  pogger.event(
                    "[ReactionRoles]: Created new agent role embed."
                  );
                }
              );
            });
          break;
        case "Verificationrole":
          const VerifyEmbed = new EmbedBuilder()
            .setTitle(
              "<:GemBotV2:1005081342121353246> GemBot  ·  Server Verification <:GemBotV2:1005081342121353246>"
            )
            .setDescription(
              "**Unlock all the channels by reacting to the bridge emoji below this message.**\n\n > Happy Chatting, and enjoy acess to *The Bridge*"
            )
            .setColor("#ffffff");
          await interaction.reply({
            content:
              "> <a:discord:1002374117904883812> Reaction role embed successfully sent.",
            ephemeral: true,
          });
          await interaction.channel
            .send({ embeds: [VerifyEmbed] })
            .then((message) => {
              Promise.all([message.react("🌉")]);

              const objdata = {
                messageid: message.id,
                channelid: message.channelId,
              };
              fs.writeFile(
                "./structures/json/reactionroles/verify.json",
                JSON.stringify(objdata),
                function (err) {
                  if (err) throw err;

                  pogger.event(
                    "[ReactionRoles]: Created new verify role embed."
                  );
                }
              );
            });
          break;
        case "Notificationroles":
          const NotificationRolesEmbed = new EmbedBuilder()
            .setTitle(
              "<:GemBotV2:1005081342121353246> GemBot  ·  Notification roles <:GemBotV2:1005081342121353246>"
            )
            .setDescription(
              "> Select your server notifications\n\n<a:discord:1002374117904883812> - **Discord updates** \n<:twitch:1000043549963866146> - **Twitch updates**\n<:yt:1000043551863877772> - **YouTube updates**"
            )
            .setColor("#ffffff");
          await interaction.reply({
            content:
              "> <a:discord:1002374117904883812> Notification roles embed successfully sent.",
            ephemeral: true,
          });
          await interaction.channel
            .send({ embeds: [NotificationRolesEmbed] })
            .then((message) => {
              let guild = client.guilds.cache.find(
                (guild) => guild.id === "998972221198434354"
              );
              let devGuild = client.guilds.cache.find(
                (guild) => guild.id === "1002348582701105283"
              );
              Promise.all([
                message.react(
                  guild.emojis.cache.find((emoji) => emoji.name === "yt")
                ),
                message.react(
                  guild.emojis.cache.find((emoji) => emoji.name === "twitch")
                ),
                message.react(
                  devGuild.emojis.cache.find(
                    (emoji) => emoji.name === "discord"
                  )
                ),
              ]);

              const objdata = {
                messageid: message.id,
                channelid: message.channelId,
              };
              fs.writeFile(
                "./structures/json/reactionroles/notifications.json",
                JSON.stringify(objdata),
                function (err) {
                  if (err) throw err;

                  pogger.event(
                    "[ReactionRoles]: Created new notification role embed."
                  );
                }
              );
            });
          break;
      }
    }
  },
};
