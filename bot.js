const Discord = require('discord.js');
const client = new Discord.Client(
    {intents: ["GUILD_MESSAGES", "GUILD_VOICE_STATES", "GUILDS"]}
);
const config = require('./config.json');
const commands = require(`./bin/commands`);
if(!config.PREFIX || !config.BOT_TOKEN) {
    console.error("Error: the configuration file was configured properly.");
    console.error("Make sure there are no spelling mistakes.");
    process.exit(1);
}
client.on('message', msg => {
    if (msg.content.startsWith(config.PREFIX)) {
        const commandBody = msg.content.substring(config.PREFIX.length).split(' ');
		cmd=commandBody[0].toLowerCase();
        if (cmd === ('открой')||cmd === ('зайди'))commands.enter(msg);
        if (cmd === ('заебал')||cmd === ('выйди')|| cmd === ('вийди') || cmd === ('пошёл')||cmd === ('надоел'))commands.exit(msg);
    }
});
client.login(config.BOT_TOKEN);
client.on('ready', () => {
    console.log(`\nONLINE\n`);
});