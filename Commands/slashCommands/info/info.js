const {
  CommandInteraction,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");

const moment = require("moment");
const ms = require("ms");

module.exports = {
  name: "info",
  description: "Returns Info Based On The Command",
  options: [
    {
      name: "user",
      description: "Get The User Info",
      type: "1",
      options: [
        {
          name: "user",
          description: "Select The User",
          type: "6",
          userTypes: ["USER", "GUILD_MEMBER"],
          required: true,
        },
      ],
    },
    {
      name: "server",
      description: "Get The Server Info",
      type: "1",
      serverTypes: ["GUILD"],
    },
  ],

  /**
   *
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const { guild, options } = interaction;

    try {
      switch (options.getSubcommand()) {
        case "user":
          {
            const Target = options.getMember("user");
            await Target.fetch();

            /**
             *
             * @param {Target} Target
             */
            async function displayHex(Target) {
              if (Target.displayHexColor !== "#000000") {
                return Target.displayHexColor;
              } else {
                return "#2F3136"; // Transparent
              }
            }

            const Response = new EmbedBuilder()
              .setColor("#ffffff")
              .setAuthor({
                name: `${Target.user.tag}'s Information`,
                iconURL: Target.user.avatarURL({
                  dynamic: true,
                }),
              })
              .setThumbnail(
                `${Target.user.displayAvatarURL({
                  dynamic: true,
                  size: 1024,
                })}`
              )
              .addFields({
                name: "<:iconreply:1005097394561634362> GENERAL",
                value: `
 
                         **\`•\` Name**: ${Target.user}
                         **\`•\` ID**: ${Target.user.id}
                         **\`•\` Roles**: ${
                           Target.roles.cache
                             .map((r) => r)
                             .join(" ")
                             .replace("@everyone", " ") || "None"
                         }
                         **\`•\` Joined Server**: <t:${parseInt(
                           Target.joinedTimestamp / 1000
                         )}:R>
                         **\`•\` Joined Discord**: <t:${parseInt(
                           Target.user.createdTimestamp / 1000
                         )}:R>
                         ㅤ
                         `,
                inline: false,
              });

            interaction.reply({
              embeds: [Response],
              ephemeral: true,
            });
          }
          break;

        case "server":
          {
            const explicitFilter = {
              DISABLED: "Off",
              MEMBERS_WITHOUT_ROLES: "No Role",
              ALL_MEMBERS: "Everyone",
            };

            const verificationRate = {
              NONE: "None",
              LOW: "Low",
              MEDIUM: "Medium",
              HIGH: "High",
              VERY_HIGH: "Highest",
            };

            const Response = new EmbedBuilder()
              .setTitle(`Server Info:`)
              .setColor("#ffffff")
              .setThumbnail(guild.iconURL({ dynamic: false, size: 1024 }))
              .addFields(
                {
                  name: "<:iconreply:1005097394561634362> 📝 GENERAL:",
                  value: `
 
                             **\`•\` Name**: ${guild.name}
                             **\`•\` ID**: ${guild.id}
                             **\`•\` Created**: <t:${parseInt(
                               guild.createdTimestamp / 1000
                             )}:R>
                             **\`•\` Owner**: <@${guild.ownerId}>
                             **\`•\` Description**: ${
                               guild.description || "None"
                             }
                             **\`•\` Verification Rate**: ${
                               verificationRate[guild.verificationLevel] ||
                               "None"
                             }
                             **\`•\` Explicit Filter**: ${
                               explicitFilter[guild.explicitContentFilter] ||
                               "None"
                             }
                             ㅤ
                             `,
                  inline: true,
                },
                {
                  name: "<:iconreply:1005097394561634362> 👥 MEMBERS: ",
                  value: `
                             **\`•\` Total Members**: ${
                               guild.members.cache.size
                             }
                             **\`•\` Users**: ${
                               guild.members.cache.filter((m) => !m.user.bot)
                                 .size
                             }
                             **\`•\` Bots**: ${
                               guild.members.cache.filter((m) => m.user.bot)
                                 .size
                             }
                             ㅤ
                             `,
                  inline: false,
                },
                {
                  name: "<:iconreply:1005097394561634362> 💬 CHANNELS: ",
                  value: `
                             **\`•\` Total Channels**: ${
                               guild.channels.cache.size
                             }
                             **\`•\` Text**: ${
                               guild.channels.cache.filter(
                                 (c) => c.type === "GUILD_TEXT"
                               ).size
                             }
                             **\`•\` Voice**: ${
                               guild.channels.cache.filter(
                                 (c) => c.type === "GUILD_VOICE"
                               ).size
                             }
                             **\`•\` Threads**: ${
                               guild.channels.cache.filter(
                                 (c) =>
                                   c.type === "GUILD_NEWS_THREAD" &&
                                   "GUILD_PUBLIC_THREAD" &&
                                   "GUILD_PRIVATE_THREAD"
                               ).size
                             }
                             **\`•\` Categories**: ${
                               guild.channels.cache.filter(
                                 (c) => c.type === "GUILD_CATEGORY"
                               ).size
                             }
                             **\`•\` Stages**: ${
                               guild.channels.cache.filter(
                                 (c) => c.type === "GUILD_STAGE_VOICE"
                               ).size
                             }
                             **\`•\` News**: ${
                               guild.channels.cache.filter(
                                 (c) => c.type === "GUILD_NEWS"
                               ).size
                             }
                             ㅤ
                             `,
                  inline: false,
                }
              )
              .setFooter({ text: "Last Checked: " })
              .setTimestamp();
            interaction.reply({
              embeds: [Response],
              ephemeral: true,
            });
          }
          break;
      }
    } catch (err) {}
  },
};
