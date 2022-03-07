const { DataTypes } = require('sequelize')

const db = require ('../db/conn')

//usuario
const User = require('./User')

const Bank = db.define('Bank', {
    tipodeconta: {
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
    contacorrente: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0,
    },
    contapoupanca: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0,
    },
})

Bank.belongsTo(User, {
    foreignKey: {
        allowNull:false,
        require:true,
    }
})
User.hasMany(Bank)

module.exports = Bank