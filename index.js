require('dotenv').config();

const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

// Initialize Mongoose
async function connect() {
await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(console.log("Connected to MongoDB!"));
}

connect()

// Middleware
app.use(passport.initialize());

app.use(session({
    secret: process.env.PASSPORT_SECRET,
    saveUninitialized: false,
    resave: false
}));

app.use(passport.session());

// Strategies
require('./api/auth/strategies/discord');

// API

app.use('/api/auth', require('./api/auth/auth.js'));

// Views
app.get('/', (req, res) => {
    if(req.isAuthenticated())
        return res.redirect('/dashboard');

    res.render('index');
});

const Discord = require('discord.js');
const {
    Client,
    Options,
    Intents
  } = require("discord.js");
  global.client = new Client({
    makeCache: Options.cacheWithLimits({
          MessageManager: 200, 
      }),
    intents: new Intents(32767),
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true }
  });

client.on('ready', () => {
    console.log(`* ${client.user.tag} has been initialized.`);
});

client.on('messageCreate', message => {
    if(message.author.bot) return;

});

client.login(process.env.TOKEN);

app.get('/dashboard', async (req, res) => {
    if(!req.isAuthenticated())
        return res.redirect('/api/auth');

         const member = await client.guilds.cache.get(process.env.DISCORD_SERVERID).members.fetch(req.user.discordId);

          if(!member) {
            const browser = await require('puppeteer').launch({headless: false});
            const page = await browser.newPage();
        
            await page.goto('https://discord.gg/FYGBBgJ3Xx');
            await browser.close();
        
            req.logOut();
            return res.redirect('/');
        }

  //Beta role function:
    if(!member.roles.cache.some(r => r.id === process.env.DISCORD_ROLEID)) { return res.render('nobeta') }

    res.render('dashboard', {
        user: req.user,
        member: member
    });
});

if (console.error()) {
    res.render(`error`);
}

if (console.warn()) {
    res.render(`error`);
}

app.get('/logout', (req, res) => {
    req.logOut();
    res.redirect(`/`);
});

app.get('*', (req,res) => {
    res.status(404);
    res.render(`404`);
})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port http://localhost:${process.env.PORT}`);
});