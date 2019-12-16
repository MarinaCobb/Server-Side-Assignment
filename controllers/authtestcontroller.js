var express = require('express');
var router = express.Router();
var sequelize = require('../db');
var User = sequelize.import('../models/user');
var AuthTestModel = sequelize.import("../models/authtest")

router.get("/getall", function (req, res) {
    //grabbing all of the Grocery List items from data
    //database for a given user
    var userid = req.user.id
    AuthTestModel.findAll({
        where: { owner: userid }
    }).then(
        function findAllSuccess(data) {
            res.json(data)
        }, function findAll(err) {
            res.send(500, err.message)
        })
})

//posting data for given user
router.post("/create", function (req, res) {
    var owner = req.user.id
    var authTestData = req.body.authtestdata.item

    AuthTestModel.create({
        authtestdata: authTestData,
        owner: owner
    }).then(
        function createSuccess(authtestdata) {
            res.json({
                authtestdata: authtestdata
            })
        },
        function createError(err) {
            res.send(500, err.message)
        }
    )
})

//localhost:3000/[Primary Key Number]
//localhost:3000/authtest/6
router.get("/:id", function (req, res) {
    var primaryKey = req.params.id
    var userid = req.user.id
    AuthTestModel.findOne({
        where: {
            id: primaryKey,
            owner: userid
        }
    }).then(
        data => {
            return data ? res.json(data) :
                res.send("Not authorized to view row")
        }),
        (err => res.send(500, err.message))
})

router.delete("/delete/:id", function (req, res) {
    var primaryKey = req.params.id
    var userid = req.user.id

    AuthTestModel.destroy({
        where: { id: primaryKey, owner: userid }
    }).then(data => {
        return res.json(data)
    }),
        err => res.send(500, err.message)
})

//Updating record for the individual
//Endpoint: /update/[number here]
//Actual URL: localhost:3000/authtest/update/10

router.put("/update/:id", function (req, res) {
    var userid = req.user.id
    var primaryKey = req.params.id
    var authtestdata = req.body.authtestdata.item

    AuthTestModel.update({
        authtestdata: authtestdata
    },
        { where: { id: primaryKey, owner: userid } }
    ).then(
        data => {
            return data? res.json(data): res.send("Not authorized to update row")
        }),
        err => res.send(500, err.message)
})

module.exports = router