const Levels = require("discord-xp");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "add-xp",
  description: "Add XP to a member",
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
        const hasLeveledUp = await Levels.appendXp(args[0].toString().substring(2, 20), message.guildId, args[1]);
        message.reply({
          embeds: [new EmbedBuilder().setColor("#ffffff").setDescription(`> ♻️ You added ${args[1]} XP to <@${args[0].toString().substring(2, 20)}>.`)],
        });

        if (hasLeveledUp) {
          const user = await Levels.fetch(args[0].toString().substring(2, 20), message.guildId);
          message.reply(`> :tada: <@${args[0].toString().substring(2, 20)}>, congratulations! You have leveled up to **Lvl. ${user.level}**.`);
          const memberData = message.guild.members.cache.get(args[0].toString().substring(2, 20));
          if (user.level === 5) memberData.roles.add(message.guild.roles.cache.find((r) => r.name === "Level・Ⅴ +"));
          if (user.level === 10) memberData.roles.add(message.guild.roles.cache.find((r) => r.name === "Level・Ⅹ +"));

          if (user.level === 15) memberData.roles.add(message.guild.roles.cache.find((r) => r.name === "Level・ⅩⅤ +"));
          if (user.level === 20) memberData.roles.add(message.guild.roles.cache.find((r) => r.name === "Level・ⅩⅩ +"));

          if (user.level === 25) memberData.roles.add(message.guild.roles.cache.find((r) => r.name === "Level・ⅩⅩⅤ +"));
          if (user.level === 30) memberData.roles.add(message.guild.roles.cache.find((r) => r.name === "Level・ⅩⅩⅩ +"));
        }
      }
    }
  },
};
