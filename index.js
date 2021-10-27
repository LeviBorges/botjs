const express = require('express');
const app = express();

app.get("/", (request, response) => {
  const ping = new Date();
  ping.setHours(ping.getHours() - 3);
  console.log(`Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`);
  response.sendStatus(200);
});

app.listen(process.env.PORT); //Recebe solicitações que o deixa online

const Discord = require("discord.js"); //Conexão com  a livraria Discord.js
const Ytdl = require("ytdl-core"); //Conexão com a livraria ytdl-core.js
const FFmpeg = require("ffmpeg");
const Avconv = require("avconv");
const client = new Discord.Client(); //Criação de um novo client
const config = require("./config.json"); //Pegando o prefixo do bot para respostas de comando
let estouPronto = false;
let connection;
client.on("guildMemberAdd", async (member) => {

  let guild = client.guilds.cache.get("712059759586443305"); //ID servidor
  let channel = client.channels.cache.get("745305144044027964"); //ID canal
  let emoji = member.guild.emojis.cache.find(emoji => emoji.name === 'peepohappy');
  if (guild != member.guild) {

    return console.log('Sai daqui seu entrosa lado! Você não é do meu servidor.');

  } else {

    let embed = new Discord.MessageEmbed()//conteúdo do canal de boas vindas do servidor
      .setColor("#C8A2C8")
      .setAuthor(member.user.tag, member.user.displayAvatarURL())
      .setTitle(`${emoji} Boas-vindas casada ${emoji}`)
      .setImage('https://media1.tenor.com/images/7218a8632ea911313ba4cf416f0b1be3/tenor.gif?itemid=17336855')
      .setDescription(`${member.user}, boas-vindas ao servidor ${guild.name}! Atualmente estamos com ${member.guild.memberCount} membros! Como vai seu marido?`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
      .setFooter('ID do usuário: ' + member.user.id)
      .setTimestamp();

    await channel.send(embed)
  }
});

client.on('message', message => {
  if (message.author.bot) return;
  if (message.channel.type == 'dm') return;
  if (!message.content.toLowerCase().startsWith(config.prefix)) return;
  if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@$
     {client.user.id}>`)) return;


  const args = message.content
    .trim().slice(config.prefix.length)
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  try {
    const commandFile = require(`./commands/${command}.js`)
    commandFile.run(client, message, args);
  } catch (err) {
    console.error('Erro:' + err);
  }

});
//base comando 

client.on("ready", () => {
  let activities = [
    `Utilize ${config.prefix}help para obter ajuda`,
    `${client.guilds.cache.size} servidores!`,
    `${client.channels.cache.size} canais!`,
    `${client.users.cache.size} usuários!`,
    `Bom dia, zap!`

  ],
    i = 0;
  setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`, {
    type: "WATCHING"
  }), 1000 * 60);
  client.user
    .setStatus("dnd")
    .catch(console.error);
  console.log("Estou Online!")
});
//status


client.login(process.env.TOKEN); //Liga o bot após confirmar o token


