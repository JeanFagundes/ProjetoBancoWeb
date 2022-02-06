const { DataTypes } = require('sequelize')

const db = require ('../db/conn')

//usuario
const User = require('./User')

const Bank = db.define('Bank', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    },
    agencia: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    },
    conta: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    },
})

Bank.belongsTo(User)
User.hasMany(Bank)

module.exports = Bank