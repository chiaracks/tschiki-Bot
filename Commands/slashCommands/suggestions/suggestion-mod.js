const { ApplicationCommandType, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const suggestDB = require("../../../structures/schemas/suggestDB");
const suggestSetupDB = require("../../../structures/schemas/suggestSetupDB");

module.exports = {
	name: 'suggestion-mod',
	description: "Accept or decline a suggestion.",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
    userPerms: ['BanMembers'],
    options: [
        {
          name: "accept",
          description: "Accept a suggestion.",
          type: "1",
          options: [
            {name: "message-id", description: "The message id of the suggestion you want to accept.", type: "3", required: true},
            {name: "reason", description: "The reason why this suggestion was accepted.", type: "3", required: true}
          ]
        },
        {
          name: "decline",
          description: "Decline a suggestion.",
          type: "1",
          options: [
            {name: "message-id", description: "The message id of the suggestion you want to decline.", type: "3", required: true},
            {name: "reason", description: "The reason why this suggestion was declined.", type: "3", required: true}
          ]
        },
        {
          name: "delete",
          description: "Delete a suggestion.",
          type: "1",
          options: [
            {name: "message-id", description: "The message id of the suggestion you want to decline.", type: "3", required: true},
          ]
        },
      ],
	run: async (client, interaction) => {
        const messageId = interaction.options.getString("message-id");
    const reason = interaction.options.getString("reason");

    if(reason) {
      if(reason.length > 1024)
      return interaction.reply({embeds: [new EmbedBuilder().setColor("#ff5e5e").setDescription(`> ❌ Your reason can't be longer than 1024 characters.`)], ephemeral: true})
    }
    
    const suggestSetup = await suggestSetupDB.findOne({ GuildID: interaction.guildId });
    var suggestionsChannel;

    if(!suggestSetup) {
      return interaction.reply({embeds: [new EmbedBuilder().setColor("#ff5e5e").setDescription(`> ❌ This server has not setup the suggestion system.`)]})
    } else {
      suggestionsChannel = interaction.guild.channels.cache.get(suggestSetup.ChannelID)
    }
    
    if(interaction.options.getSubcommand() != "delete") {
      if(suggestSetup.SuggestionManagers.length <= 0 || !suggestSetup.SuggestionManagers) {
        if(!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
          return interaction.reply({embeds: [new EmbedBuilder().setColor("#ff5e5e").setDescription(`> ❌ You are not a suggestion manager.`)], ephemeral: true});
      } else {
        for (var i = 0; i < suggestSetup.SuggestionManagers.length; i++) {
          if (!interaction.member.roles.cache.has(suggestSetup.SuggestionManagers[i])) 
            continue;
           
          if (interaction.member.roles.cache.has(suggestSetup.SuggestionManagers[i])) 
            var suggestionManager = true;
      }
      if(!suggestionManager)
        return interaction.reply({embeds: [new EmbedBuilder().setColor("#ff5e5e").setDescription(`> ❌ You are not a suggestion manager.`)], ephemeral: true});
      }
    }

    
    const suggestion = await suggestDB.findOne({GuildID: interaction.guild.id, MessageID: messageId});

    if(!suggestion)
      return interaction.reply({embeds: [new EmbedBuilder().setColor("#ff5e5e").setDescription(`> ❌ This suggestion was not found in the database.`)], ephemeral: true})

    const message = await suggestionsChannel.messages.fetch(messageId)

    if(!message)
      return interaction.reply({embeds: [new EmbedBuilder().setColor("#ff5e5e").setDescription(`> ❌ This message was not found.`)], ephemeral: true})

    const Embed = message.embeds[0];
    if(!Embed) return;
    
    switch(interaction.options.getSubcommand()) {
      case "accept":
        Embed.fields[1] = {name: "Status", value: "> Accepted", inline: false};
        Embed.fields[2] = {name: "Reason", value: `> ${reason}`, inline: false}
        message.edit({embeds: [Embed.setColor("#71ff5e")], content: `<@${suggestion.MemberID}>`, components: []});

        if(suggestion.DM) {
          const member = client.users.cache.get(suggestion.MemberID);
          member.send({embeds: [new EmbedBuilder().setColor("#71ff5e").setTitle("Suggestion 💡").setDescription(`> ✅ Your suggestion was accepted.`).addFields({name: "Suggestion", value: `[link](${message.url})`, inline: true}, {name: "Guild", value: `${interaction.guild.name}`, inline: true}, {name: "Reason", value: `${reason}`, inline: true})]}).catch(() => null)
        }
        return interaction.reply({embeds: [new EmbedBuilder().setColor("#ffffff").setDescription(`> ✅ [Suggestion](${message.url}) was accepted.`)], ephemeral: true})
      break;

      case "decline":
        Embed.fields[1] = {name: "Status", value: "> Declined", inline: false};
        Embed.fields[2] = {name: "Reason", value: `> ${reason}`, inline: false}
        message.edit({embeds: [Embed.setColor("#ff5e5e")], content: `<@${suggestion.MemberID}>`, components: []});

        if(suggestion.DM) {
          const member = client.users.cache.get(suggestion.MemberID);
          member.send({embeds: [new EmbedBuilder().setColor("#ff5e5e").setTitle("Suggestion 💡").setDescription(`> ❌ Your suggestion was declined.`).addFields({name: "Suggestion", value: `[link](${message.url})`, inline: true}, {name: "Guild", value: `${interaction.guild.name}`, inline: true}, {name: "Reason", value: `${reason}`, inline: true})]}).catch(() => null)
        }
        return interaction.reply({embeds: [new EmbedBuilder().setColor("#ffffff").setDescription(`> ✅ [Suggestion](${message.url}) declined.`)], ephemeral: true})
      break;
      
      case "delete":
        if(!suggestSetup.AllowOwnSuggestionDelete && !suggestionManager) {
          return interaction.reply({embeds: [new EmbedBuilder().setColor("#ff5e5e").setDescription(`> ❌ You cannot delete this [suggestion](${message.url})`)]})
        } else if (suggestionManager) {
          await message.delete()
          return interaction.reply({embeds: [new EmbedBuilder().setColor("#ffffff").setDescription(`> ✅ This suggestion was deleted.`)]})
        } else if(suggestSetup.AllowOwnSuggestionDelete) {
          if(suggestion.MemberID === interaction.member.id) {
            await message.delete()
            return interaction.reply({embeds: [new EmbedBuilder().setColor("#ffffff").setDescription(`> ✅ Your suggestion was deleted.`)]})  
          } else {
            return interaction.reply({embeds: [new EmbedBuilder().setColor("#ff5e5e").setDescription(`> ❌ This isn't your suggestion.`)]})  
          }
          
        }
      break;
    }
	}
};