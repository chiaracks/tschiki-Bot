const {
  EmbedBuilder,
  ChatInputCommandInteraction,
  ApplicationCommandType,
  Client,
  ChannelType,
  UserFlags,
  version,
} = require("discord.js");

const { connection } = require("mongoose");
const os = require("os");

module.exports = {
  name: "status",
  description: "Check bot's status.",
  type: ApplicationCommandType.ChatInput,
  cooldown: 3000,
  run: async (client, interaction) => {
    const status = ["Disconnected", "Connected", "Connecting", "Disconnecting"];

    await client.user.fetch();
    await client.application.fetch();

    const getChannelTypeSize = (type) =>
      client.channels.cache.filter((channel) => type.includes(channel.type))
        .size;

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#ffffff")
          .setTitle(
            `<:GemBotV2:1005081342121353246> GemBot  ·  Status <:GemBotV2:1005081342121353246>`
          )
          .setTimestamp()
          .setFooter({
            text: "Contact Jonas#1713 for help.",
            iconURL: client.user.displayAvatarURL({ dynamic: false }),
          })
          .setDescription(client.application.description || null)
          .addFields(
            { name: "> 👩🏻‍🔧⠀Client", value: client.user.tag, inline: false },
            {
              name: "> 📆⠀Created",
              value: `<t:${parseInt(client.user.createdTimestamp / 1000)}:R>`,
              inline: false,
            },
            {
              name: "> ☑⠀Verified",
              value: client.user.flags & UserFlags.VerifiedBot ? "Yes" : "No",
              inline: false,
            },
            {
              name: "> 👩🏻⠀Owner",
              value: `${client.application.owner.tag || "None"}`,
              inline: false,
            },
            {
              name: "> 📚⠀Database",
              value: status[connection.readyState],
              inline: false,
            },
            {
              name: "> 🖥⠀System",
              value: os
                .type()
                .replace("Windows_NT", "Windows")
                .replace("Darwin", "macOS"),
              inline: false,
            },
            {
              name: "> 🧠⠀CPU Model",
              value: `${os.cpus()[0].model}`,
              inline: false,
            },
            {
              name: "> 💾⠀CPU Usage",
              value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
                2
              )}%`,
              inline: false,
            },
            {
              name: "> ⏰⠀Up Since",
              value: `<t:${parseInt(client.readyTimestamp / 1000)}:R>`,
              inline: false,
            },
            { name: "> 👩🏻‍🔧⠀Node.js", value: process.version, inline: false },
            { name: "> 🛠⠀Discord.js", value: version, inline: false },
            { name: "> 🏓⠀Ping", value: `${client.ws.ping}ms`, inline: false },
            {
              name: "> 🤹🏻‍♀️⠀Commands",
              value: `${client.commands.size}`,
              inline: false,
            },
            {
              name: "> 🌍⠀Servers",
              value: `${client.guilds.cache.size}`,
              inline: false,
            },
            {
              name: "> 👨‍👩‍👧‍👦⠀Users",
              value: `${client.users.cache.size}`,
              inline: false,
            },
            {
              name: "> 💬⠀Text Channels",
              value: `${getChannelTypeSize([
                ChannelType.GuildText,
                ChannelType.GuildNews,
              ])}`,
              inline: false,
            },
            {
              name: "> 🎤⠀Voice Channels",
              value: `${getChannelTypeSize([
                ChannelType.GuildVoice,
                ChannelType.GuildStageVoice,
              ])}`,
              inline: false,
            },
            {
              name: "> 🧵⠀Threads",
              value: `${getChannelTypeSize([
                ChannelType.GuildPublicThread,
                ChannelType.GuildPrivateThread,
                ChannelType.GuildNewsThread,
              ])}`,
              inline: false,
            }
          ),
      ],
      ephemeral: true,
    });
  },
};
