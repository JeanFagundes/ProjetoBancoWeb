const { Sequelize } = require ('sequelize')

const sequelize = new Sequelize('bank' , 'root' , '', {
    host: 'localhost',
    dialect: 'mysql',
})

try {
    sequelize.authenticate()
    console.log('Conectamos ao BD com sucesso!')
} catch (error) {
    console.log(`Não foi possivel conectar ao BD: ${error}`)
}

module.exports = sequelize