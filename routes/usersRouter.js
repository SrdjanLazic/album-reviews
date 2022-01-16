const express = require('express');
const { sequelize, Users } = require('../models');
const jwt = require('jsonwebtoken');
const { userCheck } = require('../validation');
require('dotenv').config();

const route = express.Router();
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

route.get('/users', (req, res) => {
    Users.findAll()
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err));
});

route.get("/user/:id", (req, res) => {

    Users.findOne({ where: { id: req.params.id }}) 
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );
});

route.delete("/user/:id", (req, res) => {

    Users.findOne({where: {id: req.user.userId}})
        .then(user => {
            if(user.role == "admin"){
                Users.findOne({where: {id: req.params.id}})
                    .then(u => {
                        if(u.role == "moderator" || u.role == "user"){
                            u.destroy()
                                .then( rows => res.json(rows) )
                                .catch( err => res.status(500).json(err));
                        } else {
                            res.status(403).json({ msg: "Only users and moderators can be deleted."})
                        }
                    })
                    .catch(err => res.status(500).json(err))
            }
            else {
                res.status(403).json({ msg: "Only admin can delete users."});
            }
        }) 
});

module.exports = route;