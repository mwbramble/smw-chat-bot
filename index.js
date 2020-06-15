require('dotenv').config();
const Config = require('./config');
const tmi = require('tmi.js');

const options = {
  options: {
    debug: true
  },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: process.env.TWITCH_BOT_CHANNEL_NAME,
    password: process.env.TWITCH_OAUTH_TOKEN
  },
  channels: [Config.channel]
};

const client = new tmi.client(options);

const Cooldown = {
  cdownTime: Config.cdownTime * 1000,
  timestamps: {
    '!bracket': null,
    '!commands': null,
    '!commentators': null,
    '!discord': null,
    '!restreamer': null,
    '!runners': null,
    '!wiki': null,
  },
  
  usable: function(cmd){
    if(!this.timestamps[cmd]){
      this.timestamps[cmd] = Date.now() - this.cdownTime;
      return this.timestamps[cmd] + this.cdownTime <= Date.now();
    }
    else {
      return this.timestamps[cmd] + this.cdownTime <= Date.now();
    }
  },

  updateTimestamp: function(cmd){
    this.timestamps[cmd] = Date.now();
  }
};

const Timer = {
  interval: Config.timerInterval + 60000,
  messages: 0,

  newMsg: function(){
    this.messages++;
  }
};

const currentRunners = [];
const currentComms = [];
const currentRestreamer = [];

client.connect();
client.on('connected', () => {
  client.action(Config.channel, 'connected.');
  // setInterval(timerCmd, Timer.intverval);
});

// function timerCmd(){
//   if(Timer.messages >= Config.messageLimit && Config.useTimer){
//     client.say(Config.channel, '');
//     Timer.messages = 0;
//   }
// }

client.on('chat', (channel, user, message, self) => {
  if(self){
    return;
  }

  if(message.toLowerCase() === '!bracket'){
    if(Cooldown.usable('!bracket')){
      client.say(Config.channel, `Bracket: https://challonge.com/96Exit2020`);
      Cooldown.updateTimestamp('!bracket');
    }
    return;
  }

  if(message.toLowerCase() === '!commands'){
    if(Cooldown.usable('!commands')){
      client.say(Config.channel, `!bracket, !commands, !commentators, !discord, !runners, !wiki`);
      Cooldown.updateTimestamp('!commands');
    }
    return;
  }

  if(message.toLowerCase() === '!commentators'){
    if(Cooldown.usable('!commentators')){
      if(currentComms.length === 0){
        client.say(Config.channel, `There are no current commentators.`);
        return;
      }
      if(currentComms.length === 1){
        client.say(Config.channel, `Be sure to follow the commentator: https://twitch.tv/${currentComms[0]}`);
        return;
      }
      else {
        let msg = '';
        for(let i = 0; i < currentComms.length; i++){
          if(i === currentComms.length - 1){
            msg += ` https://twitch.tv/${currentComms[i]}`
          }
          else{
            msg += ` https://twitch.tv/${currentComms[i]} &`;
          }
        }
        client.say(Config.channel, `Be sure to follow the commentators:` + msg);
        return;
      }
    }
  }

  if(message.toLowerCase() === '!discord'){
    if(Cooldown.usable('!discord')){
      client.say(Config.channel, `SMW Discord: https://discord.gg/XzrQ26f`);
      Cooldown.updateTimestamp('!discord');
    }
    return;
  }

  if(message === 'GreenDogFrankerZ'){
    client.say(Config.channel, 'GreenDogFrankerZ');
    return;
  }

  if(message.toLowerCase() === '!restreamer'){
    if(Cooldown.usable('!runners')){
      if(currentRestreamer.length === 0){
        client.say(Config.channel, `There is no current restreamer.`);
        return;
      }
      else {
        client.say(Config.channel, `Be sure to follow the restreamer at https://twitch.tv/${currentRestreamer[0]}`);
        return;
      }
    }
  }

  if(message.toLowerCase() === '!runners'){
    if(Cooldown.usable('!runners')){
      if(currentRunners.length === 0){
        client.say(Config.channel, `There are no current runners.`);
        return;
      }
      else {
        let msg = '';
        for(let i = 0; i < currentRunners.length; i++){
          if(i === currentRunners.length - 1){
            msg += ` https://twitch.tv/${currentRunners[i]}`
          }
          else{
            msg += ` https://twitch.tv/${currentRunners[i]} &`;
          }
        }
        client.say(Config.channel, `Be sure to follow the runners:` + msg);
        return;
      }
    }
  }

  if(user.mod && message.toLowerCase().startsWith('!updatecomms')){
    let msg = message.split(' ');
    if(msg.length > 1){
      currentComms.length = 0;
      for(let i = 0; i < msg.length; i++){
        currentComms.push(msg[i]);
      }
      currentComms.shift();
      client.say(Config.channel, `Commentators updated!`);
    }
    return;
  }

  if(user.mod && message.toLowerCase().startsWith('!updaterestream')){
    let msg = message.split(' ');
    if(msg.length > 1){
      currentRestreamer.length = 0;
      for(let i = 0; i < msg.length; i++){
        currentRestreamer.push(msg[i]);
      }
      currentRestreamer.shift();
      client.say(Config.channel, `Restreamer updated!`);
    }
    return;
  }

  if(user.mod && message.toLowerCase().startsWith('!updaterunners')){
    let msg = message.split(' ');
    if(msg.length > 1){
      currentRunners.length = 0;
      for(let i = 0; i < msg.length; i++){
        currentRunners.push(msg[i]);
      }
      currentRunners.shift();
      client.say(Config.channel, `Runners updated!`);
    }
    return;
  }

  if(message.toLowerCase() === '!wiki'){
    if(Cooldown.usable('!wiki')){
      client.say(Config.channel, `SMW Wiki: https://smwspeedruns.com`);
      Cooldown.updateTimestamp('!wiki');
    }
    return;
  }

  // command template
  /*
  if(message.toLowerCase() === '!'){
    if(Cooldown.usable('!')){
      client.say(Config.channel, ``);
      Cooldown.updateTimestamp('!');
    }
    return;
  }
  */
});