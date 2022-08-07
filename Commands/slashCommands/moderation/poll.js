const { CommandInteraction, Client, EmbedBuilder } = require("discord.js");

module.exports = {
  name: 'poll',
  description: 'Create a poll.',
  userPerms: ['ManageMessages'],
  options:[
    {
        name: 'channel',
        description: 'The poll\'s Channel.',
        type: '7',
        required: true
    }
  ],
  /**
   *
   *  @param {CommandInteraction} interaction
   *  @param {Client} client
   */
  

   run: async (client, interaction) => {
    const options = interaction.options
    interaction.reply({content: "> ♻️ Please enter your poll description:"})

    const mentionedchannel = options.getChannel("channel");

    const filter = (m) => m.author.id === interaction.user.id;
    const message = interaction.channel.awaitMessages({ filter: filter, max: 1 });
          
    interaction.channel.awaitMessages({ filter: filter, max: 1 })
        .then((message) => {
            contentannounce = message.first()
            const PollEmbed = new EmbedBuilder()
              .setTitle("<:GemBot:1002403879582961754> GemBot // Discord POLL \<:GemBot:1002403879582961754>")
              .setColor("#ffffff")
              .setDescription(contentannounce.content)
              .setTimestamp()
            const messagesend = mentionedchannel.send({embeds: [PollEmbed], fetchReply: true}).then(embedMessage => {
              embedMessage.react("✅");
              embedMessage.react("❌");
            });

        })
  }
}