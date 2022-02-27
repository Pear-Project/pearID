const Discord = require('discord.js');
const {
    Client,
    Options,
    Intents
  } = require("discord.js");
  global.client = new Client({
    makeCache: Options.cacheWithLimits({
          MessageManager: 200, 
          PresenceManager: 0,
  
      }),
    intents: new Intents(32767),
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true }
  });

client.on('ready', () => {
    console.log(`* ${client.user.tag} has been initialized.`);
});

client.on('messageCreate', message => {
    if(message.author.bot) return;

    if(message.channel.id === '904373650323570738') {
        message.delete();
        
        message.channel.send({embeds: [
            new Discord.MessageEmbed()
                .setTitle("<:Bug:905202700235440179> Bug reported!")
                .setDescription(message.content)
                .setColor('GREEN')
                .setTimestamp()
                .setFooter(message.author.username,
                       message.author.avatarURL())
            ]}).then(m => {
            m.react('👍');
            m.react('👎');
        });
    }
    
    if(message.channel.id === '887806440968970270') {
        message.delete();
        
        message.channel.send({embeds: [
            new Discord.MessageEmbed()
                .setTitle("💡 New suggestion!")
                .setDescription(message.content)
                .setColor('GREEN')
                .setTimestamp()
                .setFooter(message.author.username,
                       message.author.avatarURL())
            ]}).then(m => {
            m.react('👍');
            m.react('👎');
        });
    }
});

client.login(process.env.TOKEN);