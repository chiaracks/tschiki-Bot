const {
  ApplicationCommandType,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
} = require("discord.js");
const suggestDB = require("../../../structures/schemas/suggestDB");
const suggestSetupDB = require("../../../structures/schemas/suggestSetupDB");

module.exports = {
  name: "suggest",
  description: "Create a suggestion.",
  type: ApplicationCommandType.ChatInput,
  cooldown: 3000,
  options: [
    {
      name: "type",
      description: "Select a type.",
      required: true,
      type: "3",
      choices: [
        {
          name: "Command",
          value: "Command",
        },
        {
          name: "Event",
          value: "Event",
        },
        {
          name: "System",
          value: "System",
        },
        {
          name: "Other",
          value: "Other",
        },
      ],
    },
    {
      name: "suggestion",
      description: "Describe your suggestion.",
      type: "3",
      required: true,
    },
    {
      name: "dm",
      description:
        "Set whether the bot will DM you, once your suggestion has been declined or accepted.",
      type: "5",
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const { options, guildId, member, user } = interaction;

    const suggestionsSetup = await suggestSetupDB.findOne({ GuildID: guildId });
    var suggestionsChannel;

    if (!suggestionsSetup) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#ff5e5e")
            .setDescription(
              `> ❌ This server has not setup the suggestion system.`
            ),
        ],
      });
    } else {
      suggestionsChannel = interaction.guild.channels.cache.get(
        suggestionsSetup.ChannelID
      );
    }

    if (suggestionsSetup.Disabled)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#ff5e5e")
            .setDescription(`> ❌ Suggestions are currently disabled.`),
        ],
      });

    if (suggestionsSetup.ChannelID === "None")
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#ff5e5e")
            .setDescription(`> ❌ The suggestion channel hasn't been set.`),
        ],
      });

    const type = options.getString("type");
    const suggestion = options.getString("suggestion");
    const DM = options.getBoolean("dm");

    const Embed = new EmbedBuilder()
      .setColor("#ffffff")
      .setAuthor({
        name: `${user.tag}`,
        iconURL: `${user.displayAvatarURL({ dynamic: true })}`,
      })
      .setDescription(`**Suggestion:**\n${suggestion}`)
      .addFields(
        { name: "Type", value: `> ${type}`, inline: false },
        { name: "Status", value: "> 🕐 Pending", inline: false },
        { name: "Reason", value: "> 🕐 Pending", inline: false }
      )
      .addFields(
        { name: "Upvotes", value: "> 0", inline: false },
        { name: "Downvotes", value: "> 0", inline: false },
        { name: "Overall votes", value: "> 0", inline: false }
      );

    const buttons = new ActionRowBuilder();
    buttons.addComponents(
      new ButtonBuilder()
        .setCustomId("suggestion-upvote")
        .setLabel(`Upvote`)
        .setStyle("1")
        .setEmoji(`❤️`),
      new ButtonBuilder()
        .setCustomId("suggestion-downvote")
        .setLabel(`Downvote`)
        .setStyle("1")
        .setEmoji(`💔`)
    );

    try {
      const M = await suggestionsChannel.send({
        embeds: [Embed],
        components: [buttons],
      });

      await suggestDB.create({
        GuildID: guildId,
        MessageID: M.id,
        Details: [
          {
            MemberID: member.id,
            Type: type,
            Suggestion: suggestion,
          },
        ],
        MemberID: member.id,
        DM: DM,
        UpvotesMembers: [],
        DownvotesMembers: [],
        InUse: false,
      });
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#ffffff")
            .setDescription(
              `> ✅ Your [suggestion](${M.url}) was successfully created and sent to ${suggestionsChannel}`
            ),
        ],
        ephemeral: true,
      });
    } catch (err) {
      console.log(err);
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#ff5e5e")
            .setDescription(`> ❌ An error occured.`),
        ],
      });
    }
  },
};
