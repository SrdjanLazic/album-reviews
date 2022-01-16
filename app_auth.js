// Express
const express = require("express");
const app = express();

// Validacija:
const {registerCheck, loginCheck} = require("./validation");

// Modeli i rute
const { sequelize, Users } = require('./models');
const users = require("./routes/usersRouter");
const albums = require("./routes/albumsRouter");
const artists = require("./routes/artistsRouter");
const reviews = require("./routes/reviewsRouter");

// Path, JWT, .env, bcrypt, cors
const path = require("path");
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
app.use(express.json());
require("dotenv").config();

// Cors options:
const corsOptions = {
    origin: "http://localhost:8080",
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

app.post("/register", (req, res) => {

    const check = registerCheck.validate(req.body);

    if(check.error){
        res.status(422).json({ msg: "Entered parameters are not valid. " + check.error.message });
    }
    else {
        const data = {
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
            role: req.body.role
        }

        Users.create(data).then( rows => {
        
            const user = {
                userId: rows.id,
                user: rows.email
            };
    
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            res.json({ token: token });
    
        }).catch( err => res.status(500).json({msg: "Registration unsuccessful. "}));
    }
})

app.post("/login", (req, res) => {

    const check = loginCheck.validate(req.body);

    if(check.error){
        res.status(442).json({msg: "Entered parameters are not valid. " + check.error.message});
    }
    else {
        Users.findOne({where: {email: req.body.email}})
            .then(user => {
                if(bcrypt.compareSync(req.body.password, user.password)) {
                    const userFound = {
                        userId: user.id,
                        user: user.email
                    };

                    const token = jwt.sign(userFound, process.env.ACCESS_TOKEN_SECRET);
                    res.json({token: token});
                }
                else {
                    res.status(400).json({msg: "Password is incorrect."})
                }
            })
            .catch(err => res.status(500).json({msg: "Email is incorrect"}));
    }
});


app.listen({ port: 8081 }, async () => {
    await sequelize.authenticate();
    console.log("Auth service listening on port 8081.");
});