const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const schedule = require('node-schedule');
const {Telegraf} = require('telegraf');
const username = encodeURIComponent(process.env.MONGO_USER);
const password = encodeURIComponent(process.env.MONGO_PASS);
const uri = `mongodb+srv://${username}:${password}@weathercluster.u88zpdy.mongodb.net/weather?retryWrites=true&w=majority`;
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const weather_api = process.env.OPEN_WEATHER_API_KEY;
const PORT = 5001;


// connection establishing with mongo db
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Error connecting to MongoDB:', err);
});


// getting user info from bot
bot.start( async (ctx) => {
    const userId = ctx.from.id;
    const {id : chatId} = ctx.chat;
  
  try {

    const table = mongoose.connection.collection('users');
    const user = await table.findOne({chatId : chatId});
      
    if (user) {
        ctx.reply(`welcome Back, ${user.name}!`);
        
        const {city, country, name} = user;
        const weatherinfo = await getWeatherInfo(name,city, country);    
        if (weatherinfo) {
            bot.telegram.sendMessage(user.chatId, weatherinfo);
        }
        
       } else {

        let step = 0;
        let name, city, country;
         ctx.reply('Welcome to the Weather Bot! Please tell me your name?');
         
         bot.hears(/(.+)/, async (ctx) => {
            if ( step ==0) {
                name = ctx.match[1];    
                ctx.reply(`Hello ${name}! Please tell me your city.`);
                step++;
            } else if (step ==1) {
                city = ctx.match[1];   
                ctx.reply(`Got it. What is your country?`);
                step++;
            } else if (step==2) {
                country = ctx.match[1];    
                await table.insertOne({ name, city, country, chatId });
                ctx.reply(`Thank you for providing your details. I'll send you daily weather updates for ${city}, ${country}.`);               
                
            const weatherinfo = await getWeatherInfo(name,city, country);    
            if (weatherinfo) {
                bot.telegram.sendMessage(chatId, weatherinfo);
            }
            }
           
        })  
       }
  } catch (error) {
    console.log(error);
    ctx.reply('An error occurred while saving your information. Please try again later.');
  } 

});


bot.help((ctx) => ctx.reply('Send me a messgae. I will try to assist you!'));
bot.launch();

//schedule the daily weather update at 6 am 

const job = schedule.scheduleJob('0 6 * * *', async () => {
  
    try {
        const table = mongoose.connection.collection('users');
       
      const users = await table.find().toArray();
      for (const user of users) {
        if (user) {
            const {city, country, name , chatId} = user;
           
                const weatherInfo = await getWeatherInfo(name,city,country);
                bot.telegram.sendMessage(chatId, weatherInfo);
              
            } 
      }
  }catch (error) {
    console.log(error);
  } 
      
  });


//get weather updates
async function getWeatherInfo(name, city, country) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${weather_api}`;
    const response = await axios.get(url);      
    const { main } = response.data;
    const {weather} = response.data;        
    const temperature = Math.round(main.temp - 273.15);
    const description = weather[0].description;
    const message = `Good morning, ${name}! Today in ${city}, ${country}. It will be ${description} with a temperature of ${temperature}°C. Have a great day!`;
    return message;

}

// Listening to port
const app = express();
app.use(cors());

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})
