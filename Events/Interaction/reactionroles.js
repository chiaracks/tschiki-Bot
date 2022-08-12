const { EmbedBuilder } = require("discord.js");
const client = require("../..");
const AgentRolesData = require("../../structures/json/reactionroles/agents.json");
const VerifyRoleData = require("../../structures/json/reactionroles/verify.json");
const NotificationsRoleData = require("../../structures/json/reactionroles/notifications.json");

client.on("messageReactionAdd", (reaction, user) => {
  let currentGuild = client.guilds.cache.find((guild) => guild.id === process.env.GUILD_ID);
  let currentMember = currentGuild.members.cache.get(user.id);
  if (reaction.message.channelId === AgentRolesData.channelid && reaction.message.id === AgentRolesData.messageid) {
    switch (reaction._emoji.name) {
      case "AgentRaze":
        var role = currentGuild.roles.cache.find((r) => r.name === "Raze Main");
        currentMember.roles.add(role);
        break;
      case "AgentAstra":
        var role = currentGuild.roles.cache.find((r) => r.name === "Astra Main");
        currentMember.roles.add(role);
        break;

      case "AgentCypher":
        var role = currentGuild.roles.cache.find((r) => r.name === "Cypher Main");
        currentMember.roles.add(role);
        break;

      case "AgentFade":
        var role = currentGuild.roles.cache.find((r) => r.name === "Fade Main");
        currentMember.roles.add(role);
        break;

      case "AgentChamber":
        var role = currentGuild.roles.cache.find((r) => r.name === "Chamber Main");
        currentMember.roles.add(role);
        break;

      case "AgentBrimstone":
        var role = currentGuild.roles.cache.find((r) => r.name === "Brimstone Main");
        currentMember.roles.add(role);
        break;

      case "AgentBreach":
        var role = currentGuild.roles.cache.find((r) => r.name === "Breach Main");
        currentMember.roles.add(role);
        break;

      case "AgentSova":
        var role = currentGuild.roles.cache.find((r) => r.name === "Sova Main");
        currentMember.roles.add(role);
        break;

      case "AgentJett":
        var role = currentGuild.roles.cache.find((r) => r.name === "Jett Main");
        currentMember.roles.add(role);
        break;

      case "AgentKayo":
        var role = currentGuild.roles.cache.find((r) => r.name === "Kayo Main");
        currentMember.roles.add(role);
        break;

      case "AgentKilljoy":
        var role = currentGuild.roles.cache.find((r) => r.name === "Killjoy Main");
        currentMember.roles.add(role);
        break;

      case "AgentNeon":
        var role = currentGuild.roles.cache.find((r) => r.name === "Neon Main");
        currentMember.roles.add(role);
        break;

      case "AgentOmen":
        var role = currentGuild.roles.cache.find((r) => r.name === "Omen Main");
        currentMember.roles.add(role);
        break;

      case "AgentPhoenix":
        var role = currentGuild.roles.cache.find((r) => r.name === "Phoenix Main");
        currentMember.roles.add(role);
        break;

      case "AgentReyna":
        var role = currentGuild.roles.cache.find((r) => r.name === "Reyna Main");
        currentMember.roles.add(role);
        break;
      case "AgentSage":
        var role = currentGuild.roles.cache.find((r) => r.name === "Sage Main");
        currentMember.roles.add(role);
        break;
      case "AgentSkye":
        var role = currentGuild.roles.cache.find((r) => r.name === "Skye Main");
        currentMember.roles.add(role);
        break;
      case "AgentViper":
        var role = currentGuild.roles.cache.find((r) => r.name === "Viper Main");
        currentMember.roles.add(role);
        break;
      case "AgentYoru":
        var role = currentGuild.roles.cache.find((r) => r.name === "Yoru Main");
        currentMember.roles.add(role);
        break;
    }

    const roleAdded = new EmbedBuilder().setColor("#ffffff").setDescription("> ♻️ The role was sucessfully added to your profile.");
    user.send({ embeds: [roleAdded] });
  }
  if (reaction.message.channelId === VerifyRoleData.channelid && reaction.message.id === VerifyRoleData.messageid) {
    const verifiedRole = currentGuild.roles.cache.find((r) => r.name === "Level・Ⅰ +");
    const unverifiedRole = currentGuild.roles.cache.find((r) => r.name === "Unverified");

    currentMember.roles.add(verifiedRole);
    currentMember.roles.remove(unverifiedRole);

    const verifiedEmbed = new EmbedBuilder().setColor("#ffffff").setDescription("> ♻️ You are now verified. Have fun chatting!");
    user.send({ embeds: [verifiedEmbed] });
  }
  if (reaction.message.channelId === NotificationsRoleData.channelid && reaction.message.id === NotificationsRoleData.messageid) {
    switch (reaction._emoji.name) {
      case "discord":
        var role = currentGuild.roles.cache.find((r) => r.name === "NotificationSquad");
        currentMember.roles.add(role);
        break;
      case "yt":
        var role = currentGuild.roles.cache.find((r) => r.name === "YouTube notifications");
        currentMember.roles.add(role);
        break;

      case "twitch":
        var role = currentGuild.roles.cache.find((r) => r.name === "Twitch notifications");
        currentMember.roles.add(role);
        break;
    }

    const roleAdded = new EmbedBuilder().setColor("#ffffff").setDescription("> ♻️ The role was sucessfully added to your profile.");
    user.send({ embeds: [roleAdded] });
  }
});
