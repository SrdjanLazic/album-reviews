const express = require('express');
const { sequelize, Artists, Users } = require('../models');
require('dotenv').config();
const { newArtistCheck, updateArtistCheck } = require('../validation.js');
const route = express.Router();
const jwt = require('jsonwebtoken');
route.use(express.json());
route.use(express.urlencoded({ extended: true }));

function authToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.status(401).json({ msg: err });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ msg: err });
        req.user = user;
        next();
    });
}

route.use(authToken);

route.get("/artists", (req, res) => {
    Artists.findAll()
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json(err));
})

route.post("/artists", (req, res) => {

    Users.findOne({ where: { id: req.user.userId } })
        .then(user => {
            if(user.role == "admin"){
                const check = newArtistCheck.validate(req.body);
                if(check.error){
                    res.status(422).json({ msg: check.error.message });
                }
                else {
                    Artists.create({ name: req.body.name })
                        .then( rows => res.json(rows) )
                        .catch( err => res.status(500).json(err));
                }
            } 
            else {
                res.status(403).json({ msg: "Only admin can add new artists."});
            }
        })
        .catch(err => res.status(500).json(err));
});

route.delete("/artist/:id", (req, res) => {
    Users.findOne({where: {id: req.user.userId}})
        .then(user => {
            if(user.role == "admin"){
                Artists.findOne({where: {id: req.params.id}})
                    .then(artist => {
                        artist.destroy()
                            .then( rows => res.json(rows) )
                            .catch( err => res.status(500).json(err));
                    })
                    .catch(err => res.status(500).json(err))
            }
            else {
                res.status(403).json({ msg: "Only admin can delete artists."});
            }
        })
    
});

route.get('/artist/:id', (req, res) => {
    
    Artists.findOne({ where: { id: req.params.id } })
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );
});

route.put("/artist/:id", (req, res) => {
    Users.findOne({ where: { id: req.user.userId } })
        .then(user => {
            if(user.role == "admin"){
                const check = updateArtistCheck.validate(req.body);
                if(check.error){
                    res.status(422).json({ msg: check.error.message });
                } else {
                    Artists.findOne({where: {id: req.params.id}})
                        .then(artist => {
                            artist.name = req.body.name
                            artist.save()
                                .then( rows => res.json(rows) )
                                .catch( err => res.status(500).json(err));
                        })
                        .catch(err => res.status(500).json(err))
                }
            }
            else {
                res.status(403).json({ msg: "Only admin can update artists."});
            }
        })
        .catch(err => res.status(500).json(err));
});




module.exports = route;