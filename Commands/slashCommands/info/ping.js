const { ApplicationCommandType, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ping',
  description: "Check bot's ping.",
  type: ApplicationCommandType.ChatInput,
  cooldown: 3000,
  run: async (client, interaction) => {
    await interaction.reply('> <a:discord:1002374117904883812> Pong! Please wait...');
    const msg = await interaction.fetchReply();
    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      .setColor('#f5f5f5')
      .setTimestamp()
      .setDescription(`> <a:discord:1002374117904883812> **Time:** ${Math.floor(msg.createdTimestamp - interaction.createdTimestamp)}ms\n> <a:discord:1002374117904883812> **API Ping:** ${client.ws.ping}ms`)
      .setFooter({ text: 'Contact Jonas#1713 for help.' });
    interaction.editReply({ embeds: [embed], content: ` ` });
  }
};
