const Bank = require('../models/Bank')
const User = require('../models/User')

module.exports = class BankController {

    static async registerAgencia(req, res) {
        res.render('auth/registerAgencia')
    }
    static async registerAgenciaPost(req, res) {
    
    const {tipodeconta, agencia} = req.body

    const dadosBancarios = {
        tipodeconta,
        agencia,
        conta : getRandom(),
        UserId : req.session.UserId,
    }

    const createdAgencia = await Bank.create(dadosBancarios)

    }

}

function getRandom(){
    let max = 89999
    let min = 10000
return Math.floor( Math.random() * max + min )
}