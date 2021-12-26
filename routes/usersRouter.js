const express = require('express');
const { sequelize, Users } = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({ extended: true }));


route.get('/users', (req, res) => {
    Users.findAll()
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err));
});

route.get("/user/:id", (req, res) => {

    Users.findOne({ where: { id: req.params.id }}) 
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );
})

module.exports = route;