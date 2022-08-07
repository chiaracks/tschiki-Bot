const { ApplicationCommandType, EmbedBuilder } = require("discord.js");
const pogger = __importStar(require("pogger"));
const { RepeatMode } = require("../../../structures/functions/discord-music-player/dist/Player");

module.exports = {
  name: "music",
  description: "GemBot's music system.",
  type: ApplicationCommandType.ChatInput,
  cooldown: 3000,
  options: [
    {
      name: "play",
      description: "Play some music.",
      type: "1",
      options: [
        {
          name: "song-name",
          description: "The songs name you want the bot to play.",
          type: "3",
          required: true,
        },
      ],
    },
    {
      name: "playlist",
      description: "Play a Playlist.",
      type: "1",
      options: [
        {
          name: "playlist-url",
          description: "Paste an URL you want the bot to play.",
          type: "3",
          required: true,
        },
      ],
    },
    {
      name: "skip",
      description: "Skip the current song.",
      type: "1",
    },
    {
      name: "clearqueue",
      description: "Clear the song queue.",
      type: "1",
    },
    {
      name: "removeloop",
      description: "Stop the loop.",
      type: "1",
    },
    {
      name: "toggleloop",
      description: "Loop current song.",
      type: "1",
    },
    {
      name: "togglequeueloop",
      description: "Loop current queue.",
      type: "1",
    },
    {
      name: "pause",
      description: "Pause the music.",
      type: "1",
    },
    {
      name: "resume",
      description: "Resume the music.",
      type: "1",
    },
  ],
  run: async (client, interaction) => {
    if (!interaction.member.voice.channel) {
      interaction.reply({ embeds: [new EmbedBuilder().setColor("#ffffff").setDescription(`> ❗ You have to be connected to a voice channel to use the music commands!`)] });
    }
    if (interaction.member.voice.channel.id === process.env.MUSICCHANNEL) {
      const selectedCommand = interaction.options.getSubcommand();
      switch (selectedCommand) {
        case "play":
          await interaction.reply("> <a:discord:1002374117904883812> Please wait...");

          var queue = client.player.createQueue(interaction.guild.id);
          var currentGuild = client.guilds.cache.get(process.env.GUILD_ID);
          var voiceChannelMusic = currentGuild.channels.cache.get(process.env.MUSICCHANNEL);
          await queue.join(voiceChannelMusic);
          var song = await queue.play(interaction.options.getString("song-name")).catch((err) => {
            pogger.error(err);
            if (!guildQueue) queue.stop();
          });
          var guildQueue = client.player.getQueue(interaction.guild.id);
          var replyEmbed = new EmbedBuilder()
            .setColor("#ffffff")
            .setDescription(`> ✅ Your song was added to the queue.\n\n**${guildQueue.songs[guildQueue.songs.length - 1].name}**`)
            .setImage(guildQueue.songs[guildQueue.songs.length - 1].thumbnail);
          interaction.editReply({ embeds: [replyEmbed], content: ` ` });
          break;

        case "playlist":
          if (!interaction.options.getString("playlist-url").includes("https://")) {
            interaction.reply({ embeds: [new EmbedBuilder().setColor("#ffffff").setDescription(`> ❗ Invalid Link!`)] });
          }
          var guildQueue = client.player.getQueue(interaction.guild.id);
          interaction.reply({ embeds: [new EmbedBuilder().setColor("#ffffff").setDescription(`> ✅ Your playlist was added to the queue`)], content: interaction.options.getString("playlist-url") });

          var queue = client.player.createQueue(interaction.guild.id);
          var currentGuild = client.guilds.cache.get(process.env.GUILD_ID);
          var voiceChannelMusic = currentGuild.channels.cache.get(process.env.MUSICCHANNEL);
          await queue.join(voiceChannelMusic);
          var song = await queue.playlist(interaction.options.getString("playlist-url")).catch((err) => {
            console.log(err);
            if (!guildQueue) queue.stop();
          });
          break;
        case "skip":
          var guildQueue = client.player.getQueue(interaction.guild.id);
          interaction.reply({ embeds: [new EmbedBuilder().setColor("#ffffff").setDescription(`> ✅ Skipped current song!`)] });
          guildQueue.skip();
          break;
        case "clearqueue":
          var guildQueue = client.player.getQueue(interaction.guild.id);
          guildQueue.clearQueue();
          interaction.reply({ embeds: [new EmbedBuilder().setColor("#ffffff").setDescription(`> ✅ Cleared queue!`)] });
          break;
        case "removeloop":
          var guildQueue = client.player.getQueue(interaction.guild.id);
          guildQueue.setRepeatMode(0);
          interaction.reply({ embeds: [new EmbedBuilder().setColor("#ffffff").setDescription(`> ✅ Loop removed!`)] });
          break;
        case "toggleloop":
          var guildQueue = client.player.getQueue(interaction.guild.id);
          guildQueue.setRepeatMode(1);
          interaction.reply({ embeds: [new EmbedBuilder().setColor("#ffffff").setDescription(`> ✅ Loop enabled!`)] });
          break;
        case "togglequeueloop":
          var guildQueue = client.player.getQueue(interaction.guild.id);
          guildQueue.setRepeatMode(2);
          interaction.reply({ embeds: [new EmbedBuilder().setColor("#ffffff").setDescription(`> ✅ Queue loop enabled!`)] });
          break;
        case "pause":
          var guildQueue = client.player.getQueue(interaction.guild.id);
          guildQueue.setPaused(true);
          interaction.reply({ embeds: [new EmbedBuilder().setColor("#ffffff").setDescription(`> ✅ Music stopped!`)] });
          break;
        case "resume":
          var guildQueue = client.player.getQueue(interaction.guild.id);
          guildQueue.setPaused(false);
          interaction.reply({ embeds: [new EmbedBuilder().setColor("#ffffff").setDescription(`> ✅ Music resumed!`)] });
          break;
      }
    } else {
      interaction.reply({ embeds: [new EmbedBuilder().setColor("#ffffff").setDescription(`> ❗ Music commands are only available in this voice channel <#${process.env.MUSICCHANNEL}>!`)] });
      return;
    }
  },
};
