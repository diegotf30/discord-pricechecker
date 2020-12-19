const fs = require('fs');
const mongoose = require('mongoose');
const Discord = require('discord.js');
const { prefix, token, dbURL } = require('./config.json');
const { scanForDiscounts } = require('./site_parser');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log(`Added ${file}`);
}


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  setInterval(() => scanForDiscounts(client), 5 * 60 * 1000); // Scan every 5 min
});

client.on('message', msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;
    try {
        client.commands.get(command).execute(msg, args);
    } catch (err) {
        console.error(err);
        msg.reply('there was an error trying to execute that command :/');
    }
});

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    mongoose.connection.db.dropDatabase();
    console.log('Successfully connected to DB')

    })
  .catch((err) => console.log('Failed to connect with error: ', err.message));

client.login(token);

/*
    user -> -watch $URL $en_maso_este_precio
    botto -> ya quedo brow
                add user to table (if new)
                add product to table (if new)
                    if already existent, add user id to array
*/