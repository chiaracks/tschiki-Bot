const { ApplicationCommandType, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const DB = require("../../../structures/schemas/suggestSetupDB");

module.exports = {
	name: 'suggestion-setup',
	description: "Set up the channel to where suggestions are sent.",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
    userPerms: ['BanMembers'],
    options: [
        {
            name: "help",
            description: "Display the help embed.",
            type: "1",
        },
        {
            name: "config",
            description: "Display the config for this guild.",
            type: "1",
        },
        {
            name: "create",
            description: "Create the setup required to use this suggestion system.",
            type: "1",
        },
        {
            name: "set-channel",
            description: "Set the channel where suggestions will be sent.",
            type: "1",
            options: [
                { name: "channel", description: "The channel where suggestions will be sent.", type: "7", channelTypes: ["GUILD_TEXT"], required: true }
            ]
        },
        {
            name: "reset",
            description: "Reset the suggestion system.",
            type: "1",
        },
        {
            name: "enable",
            description: "Enable the suggestion system.",
            type: "1",
        },
        {
            name: "disable",
            description: "Disable the suggestion system.",
            type: "1",
        },
        {
            name: "suggestion-managers",
            description: "The roles which can accept/decline/delete suggestions.",
            type: "1",
            options: [
                { name: "option", description: "View role managers | Add/Remove a role manager", type: "3", choices: [{ name: "view", value: "view" }, { name: "add", value: "add" }, { name: "remove", value: "remove" }], required: true },
                { name: "role", description: "Role which you want to add/remove.", type: "8", required: false },
            ]
        },
        {
            name: "allow-own-suggestion-delete",
            description: "State whether members can delete their own suggestions.",
            type: "1",
            options: [
                { name: "true-or-false", description: "true/false", type: "5", required: true },
            ]
        },

    ],
	run: async (client, interaction) => {
        var suggestSetup = await DB.findOne({ GuildID: interaction.guild.id })

        if (!suggestSetup && interaction.options.getSubcommand() != "create" && interaction.options.getSubcommand() != "help") {
            return interaction.reply({ embeds: [new EmbedBuilder().setColor("#ff5e5e").setDescription(`❌ This server has not setup the suggestion system. \n\n Please use \`/suggest-setup create\`to begin the setup process.`)] })
        } else if (suggestSetup && interaction.options.getSubcommand() == "create") {
            return interaction.reply({ embeds: [new EmbedBuilder().setColor("#ff5e5e").setDescription(`❌ This server has already setup the suggestion system.`)] })
        }

        const suggestionCommandHelp = new EmbedBuilder()
            .setColor("#ffffff")
            .setTitle(`Suggestion system setup help`)
            .setDescription(`To begin using this suggestion system, start by using the command \`/suggest-setup create\` to begin the setup process.` + `\n\n` +
                `You can then use the following commands to customise your system:` + `\n` +
                `\`•\` **/suggest-setup help**: \`Displays this embed.\`` + `\n` +
                `\`•\` **/suggest-setup config**: \`Displays the suggestion system config for this guild.\`` + `\n` +
                `\`•\` **/suggest-setup create**: \`Creates the data required to use this system.\`` + `\n` +
                `\`•\` **/suggest-setup set-channel [channel]**: \`Set the channel in which the suggestions will be sent.\`` + `\n` +
                `\`•\` **/suggest-setup reset**: \`Reset the suggestion system for this guild.\`` + `\n` +
                `\`•\` **/suggest-setup enable**: \`Enables the suggestion system.\`` + `\n` +
                `\`•\` **/suggest-setup disable**: \`Disables the suggestion system.\`` + `\n` +
                `\`•\` **/suggest-setup suggestion-managers [view/add/remove] [role]**: \`Allows you to add, remove and view the suggestion managers for this guild. Be aware that members with any of these roles can accept/decline suggestions and can delete other member's suggestions.\`` + `\n` +
                `\`•\` **/suggest-setup allow-own-suggestion-delete**: \`Set whether members can delete their own suggestion or not.\``
            )
            .setFooter({ text: "DM Jonas#1713 for help." })


        const suggestionConfigHelp = new EmbedBuilder()
            .setColor("#ffffff")
            .setTitle(`Suggestion system config help`)
            .setDescription(
                `\`•\` **Suggestions channel**: \`The channel in which suggestions are sent.\`` + `\n` +
                `\`•\` **Disabled**: \`Whether or not the suggestion system is disabled for this guild.\`` + `\n` +
                `\`•\` **Own suggestion delete**: \`Whether or not members can delete suggestions that they made\`` + `\n` +
                `\`•\` **Suggestion managers**: \`Members with any of these roles can accept/decline suggestions and can delete other member's suggestions.\``
            )
            .setFooter({ text: "DM Jonas#1713 for help." })

        switch (interaction.options.getSubcommand()) {
            case "help":
                await interaction.reply({ embeds: [suggestionCommandHelp] })
                return await interaction.followUp({ embeds: [suggestionConfigHelp] })
                break;
            case "create":
                await DB.create({ GuildID: interaction.guild.id, ChannelID: "None", SuggestionManagers: [], AllowOwnSuggestionDelete: false, Disabled: true }).then(async () => {
                    await interaction.reply({ embeds: [new EmbedBuilder().setColor("#ffffff").setTitle(`Suggestion system`).setDescription(`The suggestion system has successfully been created for ${interaction.guild.name}. \n\n To allow you to setup this system, the \`/suggest\` is currently disabled.`).setFooter({ text: "DM Jonas#1713 for help." })] })
                    await interaction.followUp({ embeds: [suggestionCommandHelp] })
                    await interaction.followUp({ embeds: [suggestionConfigHelp] })
                })

                break;
            case "set-channel":
                const channel = interaction.options.getChannel("channel");

                try {
                    await channel.send({ embeds: [new EmbedBuilder().setColor("#ffffff").setDescription(`> ✅ This channel has been set as a suggestions channel.`).setFooter({ text: "DM Jonas#1713 for help." })] }).then(async () => {
                        await DB.findOneAndUpdate({ GuildID: interaction.guild.id }, { ChannelID: channel.id }, { new: true, upsert: true })
                        interaction.reply({ embeds: [new EmbedBuilder().setColor("#ffffff").setDescription(`> ✅ ${channel} has successfully been set as the suggestions channel for ${interaction.guild.name}.`)] })
                    })
                } catch (error) {
                    if (error.message === "Missing Access") {
                        return interaction.reply({ embeds: [new EmbedBuilder().setColor("RED").setDescription(`> ❌ The bot does not have access to this channel.`)] })
                    } else {
                        return interaction.reply({ embeds: [new EmbedBuilder().setColor("RED").setDescription(`> ❌ An error occured. \n\n \`\`\`${error}\`\`\``)] })
                    }
                }
                break;
            case "config":
                const suggestionManagers = suggestSetup.SuggestionManagers.length <= 0 || !suggestSetup.SuggestionManagers ? "None" : `<@&${suggestSetup.SuggestionManagers.join(">, <@&")}>`
                const suggestionsChannel = suggestSetup.ChannelID === "None" ? "None" : `<#${suggestSetup.ChannelID}>`
                const OwnSuggestionDelete = suggestSetup.AllowOwnSuggestionDelete ? "True" : "False"
                const suggestionSystemDisabled = suggestSetup.Disabled ? "Disabled" : "Enabled"

                const configEmbed = new EmbedBuilder()
                    .setColor("#ffffff")
                    .setTitle(`Suggestion system config for ${interaction.guild.name}`)
                    .addFields(
                        { name: "Suggestions channel", value: `${suggestionsChannel}`, inline: true },
                        { name: "Disabled", value: `${suggestionSystemDisabled}`, inline: true },
                        { name: "Own suggestion delete", value: `${OwnSuggestionDelete}`, inline: true },
                        { name: "Suggestion managers", value: `${suggestionManagers}`, inline: false },
                    )

                return interaction.reply({ embeds: [configEmbed] })
                break;
            case "reset":
                DB.deleteOne({ GuildID: interaction.guild.id })
                    .then(() => {
                        return interaction.reply({ embeds: [new EmbedBuilder().setColor("#ffffff").setDescription(`> ✅ The suggestions channel has successfully been reset.`)] })
                    })
                break;
            case "enable":
                if (suggestSetup.Disabled == false)
                    return interaction.reply({ embeds: [new EmbedBuilder().setColor("#ff5e5e").setDescription(`> ❌ The suggestion system is already enabled.`)] })

                await DB.findOneAndUpdate({ GuildID: interaction.guild.id }, { Disabled: false })
                return interaction.reply({ embeds: [new EmbedBuilder().setColor("#ffffff").setDescription(`> ✅ The suggestion system has been enabled.`)] })

                break;
            case "disable":
                if (suggestSetup.Disabled == true)
                    return interaction.reply({ embeds: [new EmbedBuilder().setColor("#ff5e5e").setDescription(`> ❌ The suggestion system is already disabled.`)] })

                await DB.findOneAndUpdate({ GuildID: interaction.guild.id }, { Disabled: true })
                return interaction.reply({ embeds: [new EmbedBuilder().setColor("#ffffff").setDescription(`> ✅ The suggestion system has been disabled.`)] })

                break;
            case "suggestion-managers":
                switch (interaction.options.getString("option")) {
                    case "view":
                        const suggestionManagers = suggestSetup.SuggestionManagers.length <= 0 || !suggestSetup.SuggestionManagers ? "None" : `<@&${suggestSetup.SuggestionManagers.join(">, <@&")}>`
                        return interaction.reply({ embeds: [new EmbedBuilder().setColor("#ffffff").setTitle(`Suggestion manangers for ${interaction.guild.name}`).setDescription(`Please note that these members can accept, decline and delete suggestions.\n\n${suggestionManagers}`)] })
                        break;
                    case "add":
                        var role = interaction.options.getRole("role")
                        if (!role)
                            return interaction.reply({ embeds: [new EmbedBuilder().setColor("#ff5e5e").setDescription(`> ❌ You didn't provide a role.`)] })

                        if (suggestSetup.SuggestionManagers.includes(role.id))
                            return interaction.reply({ embeds: [new EmbedBuilder().setColor("#ff5e5e").setDescription(`> ❌ ${role} is already a suggestion manager.`)] })

                        await suggestSetup.SuggestionManagers.push(role.id)
                        await suggestSetup.save()

                        return interaction.reply({ embeds: [new EmbedBuilder().setColor("#ffffff").setDescription(`> ✅ ${role} has been added as a suggestion manager.`)] })

                        break;
                    case "remove":
                        var role = interaction.options.getRole("role")
                        if (!role)
                            return interaction.reply({ embeds: [new EmbedBuilder().setColor("#ff5e5e").setDescription(`> ❌ You didn't provide a role.`)] })

                        if (!suggestSetup.SuggestionManagers.includes(role.id))
                            return interaction.reply({ embeds: [new EmbedBuilder().setColor("#ff5e5e").setDescription(`> ❌ ${role} isn't a suggestion manager.`)] })

                        await suggestSetup.SuggestionManagers.splice(suggestSetup.SuggestionManagers.indexOf(role.id, 1))
                        await suggestSetup.save()

                        return interaction.reply({ embeds: [new EmbedBuilder().setColor("#ffffff").setDescription(`> ✅ ${role} has been removed as a suggestion manager.`)] })

                        break;
                }
                break;
            case "allow-own-suggestion-delete":
                const allowOwnSuggestionDelete = interaction.options.getBoolean("true-or-false");

                if (allowOwnSuggestionDelete) {
                    await DB.findOneAndUpdate({ GuildID: interaction.guild.id }, { AllowOwnSuggestionDelete: true })
                    return interaction.reply({ embeds: [new EmbedBuilder().setColor("#ffffff").setDescription(`> ✅ Members can now delete their own suggestions.`)] })
                } else {
                    await DB.findOneAndUpdate({ GuildID: interaction.guild.id }, { AllowOwnSuggestionDelete: false })
                    return interaction.reply({ embeds: [new EmbedBuilder().setColor("#ffffff").setDescription(`> ✅ Members can now not delete their own suggestions.`)] })
                }
                break;
        }

	}
};