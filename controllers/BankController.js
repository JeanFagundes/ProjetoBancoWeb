const Bank = require('../models/Bank')
const User = require('../models/User')
const modulo = require('../helpers/modulos')

module.exports = class BankController {

    //metodo para pegar a pagina inicial
    static async showBanks(req, res) {
        res.render('./bancos/home')
    }

    static async registerAgencia(req, res) {
        req.flash('message', 'Escolha a sua conta e agencia')

        res.render('auth/registerAgencia')

    }

    static async registerAgenciaPost(req, res) {
        console.log('voltou')
        const userid = await modulo.teste()
        console.log(userid)

        const {
            tipodeconta,
            agencia
        } = req.body

        const dadosBancarios = {
            tipodeconta,
            agencia,
            conta: getRandom(),
            UserId: userid,
        }

        //checando se ja tem conta corrente ou poupança criada 
        try {
            const checkIfContaExist = await Bank.findOne({
                where: {
                    UserId: userid,
                    tipodeconta: tipodeconta,
                }

            })

            if (checkIfContaExist) {

                req.flash('message', `Você ja tem uma ${tipodeconta}`)
                res.render('auth/registerAgencia')

                return
            }
        } catch (error) {
            console.log('Não foi possivel fazer a verificação' + error)
        }


        try {
            const createdAgencia = await Bank.create(dadosBancarios)
            req.session.userid = userid

            req.session.save(() => {
                res.redirect('/')
            })

        } catch (error) {
            console.log('Não foi possível criar os dados bancarios ' + error.message)
            res.render('/registerAgencia')

        }
    }

    static async contaCorrente(req, res) {
        res.render('auth/contaCorrente')

    }
    static async contaCorrentePost(req, res) {

    

    }
}


function getRandom() {
    let max = 89999
    let min = 10000
    return Math.floor(Math.random() * max + min)
}