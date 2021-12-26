// Express
const express = require("express");
const app = express();

// Modeli i rute
const { sequelize } = require('./models');
const users = require("./routes/usersRouter");
const albums = require("./routes/albumsRouter");
const artists = require("./routes/artistsRouter");
const reviews = require("./routes/reviewsRouter");

// Path, JWT, .env
const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config();

app.use("/admin", users, albums, artists, reviews);

function getCookies(req) {
    if (req.headers.cookie == null) return {};

    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookies = {};

    rawCookies.forEach( rawCookie => {
        const parsedCookie = rawCookie.split('=');
        parsedCookies[parsedCookie[0]] = parsedCookie[1];
    });

    return parsedCookies;
};

function authToken(req, res, next) {
    const cookies = getCookies(req);
    const token = cookies['token'];
  
    if (token == null) return res.redirect(301, '/login');
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.redirect(301, '/login');
        req.user = user;
        console.log(user);
        next();
    });
}

// TODO
app.get('/register', (req, res) => {
    res.sendFile('register.html', { root: './static' });
});

app.get('/login', (req, res) => {
    res.sendFile('login.html', { root: './static' });
});

app.get("/", authToken, (req, res) =>{
    res.sendFile('index.html', { root: './static' });
});

app.use(express.static(path.join(__dirname, 'static'))); 

app.listen({ port: 8080 }, async () => {
    await sequelize.authenticate();
    console.log("Pokrenut app server.");
});