const { EmbedBuilder } = require("discord.js");
const client = require("../..");

client.on("voiceStateUpdate", async (oldChannel, newChannel) => {
  const currentGuild = client.guilds.cache.get(process.env.GUILD_ID);
  const currentChannel = currentGuild.channels.cache.get(newChannel.channelId);
  if (newChannel.channelId === process.env.MUSICCHANNEL) {
    const informationEmbed = new EmbedBuilder().setColor("#ffffff").setDescription(`> ❗ Welcome to <#${newChannel.channelId}>. Use the \`/music\` command to play your favourite music.`);
    currentChannel.send({ embeds: [informationEmbed], content: `<@${newChannel.id}>` });
  } else {
    return;
  }
});
