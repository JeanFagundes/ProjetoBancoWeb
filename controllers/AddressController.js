const User = require('../models/User')
const Address = require('../models/Address')

module.exports = class AddressController {

    static registerAddress (req,res){
        res.render('auth/registerAddress')
    }

    static async registerAddressPost (req,res ){

            const {endereco, numero, cep, cidade, estado} = req.body

            const address = {
                endereco,
                numero,
                cep,
                cidade,
                estado,
                UserId : req.session.userid,
            }

            const createdAddress = await Address.create(address)

            res.redirect('/registerAgencia')
    }
}