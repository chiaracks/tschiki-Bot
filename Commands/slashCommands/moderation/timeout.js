const { CommandInteraction, EmbedBuilder } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "timeout",
  description: "Mute System",
  userPerms: ['ManageMessages'],
  options: [
    {
      name: "mute",
      description: "Timeout A User",
      type: "1",
      options: [
        {
          name: "user",
          description: "Provide A User To The Timeout.",
          type: "6",
          required: true,
        },
        {
          name: "length",
          description:
            "Provide Length For Timeout... [ 1 Second Up To 28 Days ]  ",
          type: "3",
          required: true,
        },
        {
          name: "reason",
          description: "Provide A Reason For The Timeout",
          type: "3",
          required: false,
        },
      ],
    },
    {
      name: "unmute",
      description: "Untimeout A User",
      type: "1",
      options: [
        {
          name: "user",
          description: "Provide A User To Untimeout.",
          type: "6",
          required: true,
        },
        {
          name: "reason",
          description: "Provide A Reason For The Untimeout",
          type: "3",
          required: false,
        },
      ],
    },
  ],
  /**
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const options = interaction.options;
    const target = options.getMember("user");
    const length = options.getString("length");
    const reason = options.getString("reason") || "No Reason Provided";
    const maxtime = ms("28d");
    if (length) timeInMs = ms(length);

    try {
      switch (options.getSubcommand()) {
        case "mute": {
          if (target.id === interaction.member.id)
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle(
                    "<:GemBot:1002403879582961754> GemBot // Error <:GemBot:1002403879582961754>"
                  )
                  .setColor("#ffffff")
                  .setDescription(
                    `Hey... ${interaction.user.username} Why Are You Trying To Mute Yourself....?`
                  )
                  .setTimestamp(),
              ],
              ephemeral: true,
            });
          if (!timeInMs)
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle(
                    "<:GemBot:1002403879582961754> GemBot // Error <:GemBot:1002403879582961754>"
                  )
                  .setColor("#ffffff")
                  .setDescription("Please Specify A Valid Time!")
                  .setTimestamp(),
              ],
              ephemeral: true,
            });
          if (timeInMs > maxtime)
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle(
                    "<:GemBot:1002403879582961754> GemBot // Error <:GemBot:1002403879582961754>"
                  )
                  .setColor("#ffffff")
                  .setDescription(
                    "Please Specify A Time Between 1 Second, And 28 Days!"
                  )
                  .setTimestamp(),
              ],
              ephemeral: true,
            });
          if (reason.length > 512)
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle(
                    "<:GemBot:1002403879582961754> GemBot // Error <:GemBot:1002403879582961754>"
                  )
                  .setColor("#ffffff")
                  .setDescription("Reason Can't Be More Than 512 Characters")
                  .setTimestamp(),
              ],
              ephemeral: true,
            });
          target.timeout(timeInMs, reason);
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("#ffffff")
                .setTitle(
                  `<:GemBot:1002403879582961754> GemBot // User muted <:GemBot:1002403879582961754>`
                )
                .addFields(
                  {
                    name: "User:",
                    value: `\`\`\`${target.user.username}\`\`\``,
                  },
                  {
                    name: "Reason:",
                    value: `\`\`\`${reason}\`\`\``,
                  },
                  {
                    name: "Time Of Mute:",
                    value: `\`\`\`${length}\`\`\``,
                  }
                ),
            ],
            ephemeral: true,
          });
        }
        case "unmute":
          {

            if (!target.communicationDisabledUntilTimestamp)
              return interaction.reply({
                embeds: [
                  new EmbedBuilder()
                    .setTitle(
                      "<:GemBot:1002403879582961754> GemBot // Error <:GemBot:1002403879582961754>"
                    )
                    .setColor("#ffffff")
                    .setDescription(`${target.user.username} Isn't Muted?`)
                    .setTimestamp(),
                ],
                ephemeral: true,
              });
            await target.timeout(null);
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor("#ffffff")
                  .setTitle(
                    "<:GemBot:1002403879582961754> GemBot // User unmuted <:GemBot:1002403879582961754>"
                  )
                  .addFields(
                    {
                      name: "User:",
                      value: `\`\`\`${target.user.username}\`\`\``,
                    },
                    {
                      name: "Reason:",
                      value: `\`\`\`${reason}\`\`\``,
                    }
                  ),
              ],
              ephemeral: true,
            });
          }
          return;
      }
    } catch (e) {
      const errorEmbed = new EmbedBuilder()
        .setColor("#ff5e5e")
        .setDescription(`🛑 Error: ${e}`);
      return interaction.reply({
        embeds: [errorEmbed],
      });
    }
  },
};
