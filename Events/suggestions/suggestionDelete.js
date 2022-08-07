const client = require('../..');
const suggestSetupDB = require("../../structures/schemas/suggestSetupDB");
const suggestDB = require("../../structures/schemas/suggestDB");

client.on('messageDelete', async message => {
    const suggestSetup = await suggestSetupDB.findOne({ GuildID: message.guild.id });
    if(!suggestSetup) return;
    
    const suggestion = await suggestDB.findOne({GuildID: message.guild.id, MessageID: message.id});
    if(!suggestion) return;

    return suggestDB.deleteOne({GuildID: message.guild.id, MessageID: message.id})
});