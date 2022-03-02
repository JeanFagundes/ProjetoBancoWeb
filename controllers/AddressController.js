const User = require('../models/User')
const Address = require('../models/Address')
const modulo = require('../helpers/modulos')


module.exports = class AddressController {

    static registerAddress(req, res) {
        req.flash('message', 'Adicione um endereço a sua conta!')
        res.render('auth/registerAddress')
    }

    static async registerAddressPost(req, res) {
        const userid = await modulo.teste()

        const {
            endereco,
            numero,
            cep,
            cidade,
            estado
        } = req.body

        const address = {
            endereco,
            numero,
            cep,
            cidade,
            estado,
            UserId: userid,
        }


        try {
            const createdAddress = await Address.create(address)


            res.redirect('/registerAgencia')

            /* req.session.save(() => {
            })*/
            
        } catch (error) {
            console.log('Não foi possivel fazer a criação do endereço, tente novamente' + error)
            res.render('/registerAddress')
        }
    }
}