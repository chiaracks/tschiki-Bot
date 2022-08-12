const { ButtonInteraction } = require("discord.js");
const client = require("../..");
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

/**
 *
 * @param {ButtonInteraction} interaction
 */

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  if (!["tournament-apply"].includes(interaction.customId)) return;

  const modal = new ModalBuilder().setCustomId("applyModal").setTitle("Tournament Application");

  const riotID = new TextInputBuilder().setCustomId("riotID").setLabel("Please enter your Riot ID:").setStyle(TextInputStyle.Short);

  const rankInput = new TextInputBuilder().setCustomId("rankInput").setLabel("Please enter your current Rank:").setStyle(TextInputStyle.Short);

  const substitute = new TextInputBuilder().setCustomId("substitute").setLabel("Are you okay with being a substitute? YES/NO").setStyle(TextInputStyle.Short);

  const fluentEnglish = new TextInputBuilder().setCustomId("fluentEnglish").setLabel("Are you fluent in English? YES/NO").setStyle(TextInputStyle.Short);

  const firstActionRow = new ActionRowBuilder().addComponents(riotID);
  const secondActionRow = new ActionRowBuilder().addComponents(rankInput);
  const thirdActionRow = new ActionRowBuilder().addComponents(substitute);
  const fourthActionRow = new ActionRowBuilder().addComponents(fluentEnglish);

  // Add inputs to the modal
  modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);

  // Show the modal to the user
  await interaction.showModal(modal);
});
