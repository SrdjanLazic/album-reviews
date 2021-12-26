const express = require('express');
const { sequelize, Artists, Albums, Users} = require('../models');
require('dotenv').config();
const { newAlbumCheck, updateAlbumCheck } = require("../validation.js");
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

route.get("/albums", (req, res) => {

    Albums.findAll({ include: ['artist'] })
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json(err));
})


route.get("/album/:id", (req, res) => {

    Albums.findOne({ where: { id: req.params.id }, include: ['artist']}) // include: artists, vezba6, pogledati Vue vezbe poslednje, paginacija
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );
})

route.delete("/album/:id", (req, res) => {

    Users.findOne({where: {id: req.user.userId}})
        .then(user => {
            if(user.role == "admin"){
                Albums.findOne({where: {id: req.params.id}})
                    .then(album => {
                        album.destroy()
                            .then( rows => res.json(rows) )
                            .catch( err => res.status(500).json(err));
                    })
                    .catch(err => res.status(500).json(err))
            }
            else {
                res.status(403).json({ msg: "Only admin can delete albums."});
            }
        })
});

route.post("/albums", (req, res) => {
    
    Users.findOne({ where: { id: req.user.userId } })
        .then(user => {
            if(user.role == "admin"){
                const check = newAlbumCheck.validate(req.body);
                if(check.error){
                    res.status(422).json({ msg: check.error.message });
                }
                else {
                    Artists.findOne({where: {id: req.body.artistId}})
                        .then(artist => {
                            Albums.create({ year: req.body.year, genre:req.body.genre, title:req.body.title, artistId: req.body.artistId })
                                    .then( rows => res.json(rows) )
                                    .catch( err => res.status(500).json(err) );
                        })
                        .catch(err => res.status(500).json(err))
                }
            }
            else {
                res.status(403).json({ msg: "Only admin can add new albums."});
            }
        })
        .catch(err => res.status(500).json(err));
    
});

route.put("/album/:id", (req, res) => {
    Users.findOne({ where: { id: req.user.userId } })
        .then(user => {
            if(user.role == "admin"){
                const check = updateAlbumCheck.validate(req.body);
                if(check.error){
                    res.status(422).json({ msg: check.error.message });
                } else {
                    Albums.findOne({where: {id: req.params.id}})
                        .then(album => {

                            album.title = req.body.title;
                            album.genre = req.body.genre;
                            album.year = req.body.year;

                            album.save()
                                .then( rows => res.json(rows) )
                                .catch( err => res.status(500).json(err));
                        })
                        .catch(err => res.status(500).json(err))
                    }
                }
                else {
                    res.status(403).json({ msg: "Only admin can update albums."});
                }
        })
        .catch(err => res.status(500).json(err))
});


module.exports = route;