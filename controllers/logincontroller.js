var express = require('express');
var router = express.Router();
var sequelize = require('../db');
var User = sequelize.import('../models/user');
var User = sequelize.import('../models/login');
var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')


//signing in a user

router.post('/', function (req, res) {
    let email = req.body.user.username
    let password = req.body.user.password

    User.findOne({
        where: { username: email }
    }).then(user => {
        if (user) {
            comparePasswords(user);
        } else {
            res.send("User not found in our database!");
        }
        function comparePasswords(user) {
            bcrypt.compare(password, user.passwordhash, function matches(err, matches) {
                matches ? generateToken(user) : res.send("Incorrect password")
            })
        }
        function generateToken(user) {
            var token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 })
            //process.env.JWT_SECRET this is going to allow variables for your server
            res.json({
                user: user,
                message: 'created',
                sessionToken: token
            })
        }

    }
    );
});

//  ternary user ? res.json(user): res.send ("User not found in our database");




module.exports = router
