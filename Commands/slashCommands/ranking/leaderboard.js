const { CommandInteraction, Client, EmbedBuilder, ApplicationCommandType } = require("discord.js");
const Levels = require("discord-xp");

module.exports = {
	name: 'leaderboard',
	description: "Shows top 10 highest ranks in the server.",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
	run: async (client, interaction) => {
        const LeaderBoard = await Levels.fetchLeaderboard(interaction.guild.id, 10);

        if (LeaderBoard.length < 1) return interaction.reply("> :exclamation: There aren't any users in the leaderboard.");

        const leaderboard = await Levels.computeLeaderboard(client, LeaderBoard, true);
        const lb = leaderboard.map(e => "```" + `${e.position}. ${e.username}#${e.discriminator}\n- Level: ${e.level}\n- XP: ${e.xp.toLocaleString()}` + "```"); 

        const response = new EmbedBuilder()
            .setAuthor({ name: "LEADERBOARD", iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setDescription(`${lb.join("\n\n")}`)
            .setColor("#f5f5f5")

        interaction.reply({embeds: [response]})
	}
};