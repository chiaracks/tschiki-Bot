const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.MessageContent],
  partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction]
});

console.clear();

const config = require('./config.json');
require('dotenv').config();

client.commands = new Collection();
client.aliases = new Collection();
client.events = new Collection();
client.slashCommands = new Collection();
client.prefix = config.prefix;

module.exports = client;

['events', 'prefixCommands', 'slashCommand', 'errorhandler'].forEach((handler) => {
  require(`./Handlers/${handler}`)(client);
});

client.login(process.env.TOKEN);
