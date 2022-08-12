const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.MessageContent],
  partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction],
});

console.clear();

require("dotenv").config();

client.commands = new Collection();
client.aliases = new Collection();
client.events = new Collection();
client.slashCommands = new Collection();
client.prefix = process.env.PREFIX;

module.exports = client;

["events", "prefixCommands", "slashCommand", "errorhandler"].forEach((handler) => {
  require(`./Handlers/${handler}`)(client);
});

client.login(process.env.TOKEN);
