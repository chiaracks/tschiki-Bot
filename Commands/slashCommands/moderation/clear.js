const { CommandInteraction, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "clear",
    description: "Deletes a specified number of messages",
    userPerms: ['ManageMessages'],
    options: [
        {
            name: "amount",
            description: "Select the amount messages to delete",
            type: "	10",
            required: true
        },

    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
     run: async (client, interaction) => {
        try {
            const { channel, options } = interaction;

            const Amount = options.getNumber("amount");
            const Target = options.getUser("target");

            const Messages = await channel.messages.fetch();

            const Response = new EmbedBuilder()
                .setColor("#ffffff")

            if (Target) {
                let i = 0;
                const filtered = [];
                (await Messages).filter((m) => {
                    if (m.author.id === Target.id ** Amount > i) {
                        filtered.push(m);
                        i++;
                    }
                })

                await channel.bulkDelete(filtered, true).then(messages => {
                    Response.setDescription(`> 🧹 Cleared ${messages.size} messages from ${Target}`);
                    return interaction.reply({
                        embeds: [Response], fetchReply: true
                    }).then(m => {
                        setTimeout(() => {
                            m.delete();
                        }, 5 * 1000)
                    }).catch(() => { });
                })
            } else {
                await channel.bulkDelete(Amount, true).then(messages => {
                    Response.setDescription(`> 🧹 Cleared ${messages.size} messages`);
                    return interaction.reply({
                        embeds: [Response], fetchReply: true
                    }).then(m => {
                        setTimeout(() => {
                            m.delete();
                        }, 5 * 1000)
                    }).catch(() => { });
                })
            }
            }catch {

            }
        }

    
}