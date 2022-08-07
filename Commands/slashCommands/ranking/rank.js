const { ApplicationCommandType, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const Levels = require("discord-xp");
const canvacord = require('canvacord');

module.exports = {
	name: 'rank',
	description: "Get the rank of a user.",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
    options:[
        {
            name: "target",
            description: "Mention a user to see their rank.",
            type: "6",
            required: false
        }
    ],
	run: async (client, interaction) => {
        const Target = interaction.options.getMember("target") || interaction.member;
        const users = await Levels.fetch(Target.id, interaction.guildId);
        
        if(!users) return interaction.reply({content: "> :exclamation: The mentioned user has no XP."})

        const neededXp = Levels.xpFor(parseInt(users.level) + 1);

        const rank = new canvacord.Rank()
        .setAvatar(Target.displayAvatarURL({format: 'png', size: 512}))
        .setCurrentXP(users.xp) 
        .setRequiredXP(neededXp)
        .setLevel(users.level)
        .setRank(10, "rank", false)
        .setProgressBar("#FFFFFF", "COLOR")
        .setUsername(Target.user.username)
        .setDiscriminator(Target.user.discriminator);
        rank.setBackground(
            'IMAGE',
            `https://media.discordapp.net/attachments/998989117545271356/1000517771140006039/Card.png`
          );
    
        rank.build()
            .then(data => {
            const attachment = new AttachmentBuilder(data, {name: 'RankCard.png'});
            interaction.reply({files: [attachment]});
        });
	}
};