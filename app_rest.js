const express = require("express");
const app = express();
const cors = require('cors');

const { sequelize } = require('./models');
const users = require("./routes/usersRouter");
const albums = require("./routes/albumsRouter");
const artists = require("./routes/artistsRouter");
const reviews = require("./routes/reviewsRouter");

const corsOptions = {
    origin: "http://localhost:8080",
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use(express.json());

app.use("/admin", users, albums, artists, reviews);

app.listen({ port: 8082 }, async () => {
    await sequelize.authenticate();
    console.log("Rest service listening on port 8082");
});