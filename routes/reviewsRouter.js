const express = require('express');
const { sequelize, Artists, Albums, Users, Reviews} = require('../models');
require('dotenv').config();
const { newReviewCheck, updateReviewCheck} = require("../validation.js");
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


route.get("/reviews", (req, res) => {
    Reviews.findAll({ 
        include: {
            model: Albums,
            as: 'album',
            include: {
                model: Artists,
                as: 'artist'
            }
        } 
    })
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json(err));
})


route.get("/review/:id", (req, res) => {
    Reviews.findOne({ 
        where: { 
            id: req.params.id 
        }, 
        include: {
            model: Albums, 
            as: 'album', 
            include: {
                model: Artists, 
                as: 'artist'
            }
        }
    })
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );
});

route.post("/reviews", (req, res) => {
    
    Users.findOne({ where: { id: req.user.userId } })
        .then(user => {
            if(user.role == "user"){
                const check = newReviewCheck.validate(req.body);
                if(check.error){
                    res.status(422).json({ msg: check.error.message });
                }
                else {
                    Albums.findOne({where: {id: req.body.albumId}})
                        .then(album => {
                            Reviews.create({ body: req.body.body, rating:req.body.rating, albumId: req.body.albumId, userId: req.user.userId})
                                    .then( rows => res.json(rows) )
                                    .catch( err => res.status(500).json(err) );
                        })
                        .catch(err => res.status(500).json(err))
                    }
                }
                else {
                    res.status(403).json({ msg: "Only users can review albums."}); 
                }
            })
            .catch(err => res.status(500).json(err));
});

route.delete("/reviews/:id", (req, res) => {

    Users.findOne({where: {id: req.user.userId}})
        .then(user => {
            if(user.role == "moderator"){
                Reviews.findOne({where: {id: req.params.id}})
                    .then(review => {
                        review.destroy()
                            .then( rows => res.json(rows) )
                            .catch( err => res.status(500).json(err));
                    })
                    .catch(err => res.status(500).json(err))
            }
            else {
                res.status(403).json({ msg: "Only moderator can delete reviews."});
            }
        })
})

route.put("/review/:id", (req, res) => {
    Users.findOne({ where: { id: req.user.userId } })
        .then(user => {
            if(user.role == "user" || user.role == "moderator"){
                const check = updateReviewCheck.validate(req.body);
                if(check.error){
                    res.status(422).json({ msg: check.error.message });
                } else {
                    Reviews.findOne({where: {id: req.params.id}})
                        .then(review => {
                            
                            review.body = req.body.body;
                            review.rating = req.body.rating;

                            review.save()
                                .then( rows => res.json(rows) )
                                .catch( err => res.status(500).json(err));
                        })
                        .catch(err => res.status(500).json(err))
                    }
                }
                else {
                    res.status(403).json({ msg: "Only users and moderator can update albums."});
                }
        })
        .catch(err => res.status(500).json(err))
});




module.exports = route;