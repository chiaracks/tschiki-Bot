const { CommandInteraction, Client } = require("discord.js");

module.exports = {
  name: 'announce',
  description: 'Announce something.',
  userPerms: ['ManageMessages'],
  options:[
    {
        name: 'channel',
        description: 'The announce Channel.',
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
    interaction.reply({content: "> ♻️ Please enter your announcement:"})

    const mentionedchannel = options.getChannel("channel");

    const filter = (m) => m.author.id === interaction.user.id;
    const message = interaction.channel.awaitMessages({ filter: filter, max: 1 });
          
    interaction.channel.awaitMessages({ filter: filter, max: 1 })
        .then((message) => {
            contentannounce = message.first()
            mentionedchannel.send({content: contentannounce.content})
        })
  }
}