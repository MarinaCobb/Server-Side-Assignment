module.exports= function (sequelize, DataTypes) {
    return sequelize.define('login',{
        username:DataTypes.STRING,
        passwordhash:DataTypes.STRING
    })
}