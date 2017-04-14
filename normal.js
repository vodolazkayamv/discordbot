const fs = require("fs");
var jsonfile = require('jsonfile')
var Discord = require("discord.js");
var bot = new Discord.Client();

var http = require('http');

http.createServer(function (request, response) {
  console.log('Creating server...');
}).listen(5000);

console.log('Server running at http://127.0.0.1:5000/');

bot.on("message", msg => {
  // Set the prefix
  let prefix = "!";
  // Exit and stop if it's not there
  if(!msg.content.startsWith(prefix)) return;
  // Exit if any bot
  if(msg.author.bot) return;

  if (msg.content.startsWith(prefix + "ping")) {
    msg.channel.sendMessage("pong!");
  }

  else if (msg.content.startsWith(prefix + "foo")) {
    msg.channel.sendMessage("bar!");
  }


});

// ===========================================================
// ПРОСТЫЕ ОТВЕТЫ

bot.on('message', function(message) {

      if (((message.content.indexOf('расскажи') > -1) || (message.content.indexOf('напомни') > -1)) && ((message.content.indexOf('про') > -1) || (message.content.indexOf('правил') > -1)) &&(message.content.indexOf('игр') > -1) && (message.author.username != "Нормаль")){
           message.channel.sendMessage("Всё просто. Как образованная крыса, которая не смогла найти работу по специальности, я сижу на палубе ровно, грустно вздыхаю и подсчитываю все ваши сообщения. За каждые 100 сообщений вы получите от меня уровень и памятную дырку в моем платочке. Меня всегда можно спросить о прогрессе, если вдруг кого-то это будет волновать ~~(8:>");
      }

      if (((message.content.indexOf('отвали') > -1)
            ||(message.content.indexOf('заткнись') > -1)
            ||(message.content.indexOf('убейся') > -1)
            ||(message.content.indexOf('заткнись') > -1)
            ) && (message.author.username != "Нормаль")){
           message.channel.sendMessage("фу, как грубо! Не надо так! >:[");
      }



});


bot.on('message', function(message) {
    if(message.author.bot) return;
    var msg = message.content.toLowerCase();

    for (var i = 0; i < brain.counters.length; i++) {
            var counter = brain.counters[i];
            var regex = counter.ask;
            regex = counter.ask.replace("*", "(.*)");
            //console.log(regex,' -> ', msg.match(regex));
            //console.log(msg.match(regex) != null);
            if (msg.match(regex) && counter.ask != "")
            {
                var k = getRandomInt(0,counter.responses.length);
                var response = counter.responses[k];
                console.dir(counter.ask);
                console.log(regex);
                console.dir(response);
                message.channel.sendMessage(response.answer);
                return;
            }
        }

});

// ===========================================================
// КАНАЛ ДЛЯ ОБУЧЕНИЯ
//let brain = JSON.parse(fs.readFileSync('ratBrain', 'utf8'));
var ratBrain = 'ratBrain.json'
var brain = jsonfile.readFileSync(ratBrain);


bot.on("message", message => {
    if(message.author.bot) return;
    if (message.channel.name == 'traintherat' || message.channel.name == 'trum_s_krysoj' ){
        console.log("обучаюсь!");

        if (message.content == "покажи мозг")
        {
            var test = JSON.stringify(brain);
            test = test.replace(new RegExp('"ask":"","responses":[(.*)]', 'i'), '\n');
            test = test.replace(new RegExp('{', 'g'), '\n');
            test = test.replace(new RegExp('}', 'g'), '\n');

            message.channel.sendMessage('```'+test+'```');
            return;
        }
        var text = message.content.toLowerCase();
        console.log('try to teach: ', text);
        try {
                JSON.parse(message.content, (key, value) => {
                    for (var i = 0; i < brain.counters.length; i++) {
                        var counter = brain.counters[i];
                        if (counter.ask == key)
                        {
                            console.log('here it is!');
                            for (var j = 0; j < counter.responses.length; j++) {
                                var answer = counter.responses[j];
                                if (answer.answer == value)
                                {
                                    return;
                                }
                            }
                            counter.responses.push({"num":counter.responses.length, "answer":value});
                            fs.writeFile(ratBrain, JSON.stringify(brain), console.error);
                            message.channel.sendMessage('вроде запомнила');
                            return;
                        }
                    }
                    brain.counters.push({"ask":key, "responses":[{"num":1,"answer":value}]});
                    fs.writeFile(ratBrain, JSON.stringify(brain), console.error);
                    message.channel.sendMessage('вроде запомнила');
                });
        }
        catch (e) {
            console.log('ERROR',e);
            if (e != null)
        //the json is not ok
            message.channel.sendMessage('это я не буду запоминать ><');
        }

    }
});

// ===========================================================
// ПРИВЕТСТВИЕ
bot.on("guildMemberAdd", (member) => {
    console.log(`Новый пират "${member.user.username}" пожаловал на "${member.guild.name}"` );
    member.guild.defaultChannel.sendMessage(`Хэй, команда, у нас тут новенький! Приветствуйте "${member.user.username}"`);
});

// ===========================================================
// ИГРА

let points = JSON.parse(fs.readFileSync('points.json', 'utf8'));
console.log(points);
const prefix = "+";
const prefix_g = "~";

bot.on("message", message => {
  if(message.content.startsWith(prefix)) return;
  if(message.author.bot) return;

  let userData = points[message.author.id];
  if(!userData) {
      userData = {points: 0, level: 0};
      points[message.author.id] = userData;
    }
    console.log('UD: ',userData);
  userData.points++;

  let curLevel = Math.floor(userData.points/100); //(0.1 * Math.sqrt(userData.points));
  if(curLevel > userData.level) {
    // Level up!
    userData.level = curLevel;
    message.reply(`апнул **${curLevel}** уровень!`);
    var i = getRandomInt(1,5);
    if (i == 1)
        message.channel.sendMessage("*машет платочком*");
        else if (i == 2)
            message.channel.sendMessage("*утирает слёзы счастья*");
        else if (i == 3)
            message.channel.sendMessage("*дырявит платочек*");
        else if (i == 4)
            message.channel.sendMessage("*скромно уползает*");
  }

  if ((
       (message.content.indexOf('уровень') > -1)
       ||(message.content.indexOf('лвл') > -1)
       ||(message.content.indexOf('левел') > -1)
  ) && (message.author.username != "Нормаль")
  || message.content.startsWith(prefix_g + "level")){
      message.reply(`У тебя сейчас ${userData.level} уровень и ${userData.points} очков.`);
    var i = getRandomInt(1,5);
    if (i == 1)
        message.channel.sendMessage("*недовольно уползает*");
        else if (i == 2)
            message.channel.sendMessage("*сердито уползает*");
        else if (i == 3)
            message.channel.sendMessage("*уползает кряхтя*");
        else if (i == 4)
            message.channel.sendMessage("*бубнит что-то себе под нос и скрывается между бочками с ромом*");
  }

  fs.writeFile('./points', JSON.stringify(points), console.error);
});

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
bot.on('error', e => { console.error(e); });

bot.on("ready", () => {
    console.log(`Ready to server in ${bot.channels.size} channels on ${bot.guilds.size} servers, for a total of ${bot.users.size} users.`);
});

bot.on('message', function(message) {
        if (message.channel.isPrivate) {
                console.log('PM: \t', message.author.username, ':\t' ,message.content);
        } else {
                console.log('MSG: \t', ':\t',message.channel.name, '\t->\t', message.author.username, ':\t',message.content);
        }
});


bot.login("MjYxNTE4ODQwMjY4MDYyNzIw.Cz2GEQ._wEEjADIcFPCHJ1A98ZVoxuyHvk");


// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
