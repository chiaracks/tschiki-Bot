const Levels = require("discord-xp");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "remove-xp",
  description: "Remove XP of a member",
  cooldown: 3000,
  userPerms: ["Administrator"],
  botPerms: ["Administrator"],
  run: async (client, message, args) => {
    if (!args[0]) {
      message.reply({
        embeds: [new EmbedBuilder().setColor("#ffffff").setDescription(`> ❗️ You have to mention a user.\n\`\`\`\nadd-xp [member] [xp]\n\`\`\` `)],
      });
    } else {
      if (!args[1]) {
        message.reply({
          embeds: [new EmbedBuilder().setColor("#ffffff").setDescription(`> ❗️ You have specifie the amount of xp.\n\`\`\`\nadd-xp [member] [xp]\n\`\`\` `)],
        });
      } else {
        const hasLeveledUp = await Levels.appendXp(args[0].toString().substring(2, 20), message.guildId, args[1] - args[1] * 2);
        message.reply({
          embeds: [new EmbedBuilder().setColor("#ffffff").setDescription(`> ♻️ You removed ${args[1]} XP from <@${args[0].toString().substring(2, 20)}>.`)],
        });
      }
    }
  },
};
