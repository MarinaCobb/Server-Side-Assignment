var express = require('express')
var router = express.Router()
var sequelize = require('../db')
var User = sequelize.import('../models/user');
var LogModel = sequelize.import('../models/log')

router.post("/", function (req, res) {
    var owner = req.user.id
    var description = req.body.description.item
    var definition = req.body.definition.item
    var result = req.body.result.item


    LogModel.create({
        description: description,
        definition: definition,
        result: result,
        owner: owner
    }).then(
        function createSuccess(authtestdata) {
            res.json({
                description: description,
                definition: definition,
                result: result,
            })
        },
        function createError(err) {
            res.send(500, err.message)
        }
    )
})

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




module.exports = router