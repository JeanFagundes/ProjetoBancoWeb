const { DataTypes } = require('sequelize')

const db = require ('../db/conn')

//usuario
const User = require('./User')

const Address = db.define('Address', {
    endereco: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    },
    numero: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    },
    cep: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    },
    cidade: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    },
})

Address.belongsTo(User, {
    foreignKey: {
        allowNull:false,
        require:true
    }
})
User.hasMany(Address)

module.exports = Address