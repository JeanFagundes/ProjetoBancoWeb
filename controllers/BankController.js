const Bank = require('../models/Bank')
const User = require('../models/User')
const modulo = require('../helpers/modulos')

module.exports = class BankController {

    //metodo para pegar a pagina inicial
    static async showBanks(req, res) {
        const userId = req.session.userid
        let idPoupanca, idCorrente

        if (!req.session.userid) {
            res.render('./bancos/home')
            return
        }

        const user = await User.findOne({
            where: {
                id: userId
            },
            include: Bank,
            plain: true,
        })

        if (!user) {
            res.redirect('/login')
        }

        const banks = user.Banks.map((result) => result.dataValues)

        if (!banks[0]) {
            res.redirect('/registerAgencia')
        } else {
            if (banks[0].tipodeconta === 'Conta Corrente') {
                idCorrente = banks[0].id
            } else if (banks[0].tipodeconta === 'Conta Poupanca') {
                idPoupanca = banks[0].id
            }
        }

        if (!banks[1]) {
            console.log('nao tem segunda conta')
        } else {
            if (banks[1].tipodeconta === 'Conta Corrente' && banks[1]) {
                idCorrente = banks[1].id
            } else if (banks[1].tipodeconta === 'Conta Poupanca') {
                idPoupanca = banks[1].id
            }
        }

        res.render('./bancos/home', {
            idPoupanca,
            idCorrente
        })
    }

    static async registerAgencia(req, res) {
        req.flash('message', 'Escolha a sua conta e agencia')
        res.render('auth/registerAgencia')
    }

    static async registerAgenciaPost(req, res) {
        let userid = await modulo.teste()

        if (req.session.userid) {
            userid = req.session.userid
        }

        const {
            tipodeconta,
            agencia
        } = req.body


        //checando se ja tem conta corrente ou poupança criada 
        const checkIfContaExist = await Bank.findOne({
            where: {
                UserId: userid,
                tipodeconta: tipodeconta,
            },
            raw: true
        })

        if (checkIfContaExist) {

            req.flash('message', `Você ja tem uma ${tipodeconta}`)
            res.render('auth/registerAgencia')
            return
        }

        const dadosBancarios = {
            tipodeconta,
            agencia,
            conta: getRandom(),
            UserId: userid,
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
        const id = req.params.id

        console.log('Id na conta corrente ' + id)

        let depositar = '',
            sacar = '',
            saldo = ''

        if (req.query.depositar) {
            depositar = req.query.depositar
            res.render(`bancos/contaCorrente`, {
                depositar,
                id
            })
            return
        }
        if (req.query.sacar) {
            sacar = req.query.sacar
            res.render('bancos/contaCorrente', {
                sacar,
                id
            })
            return
        }
        if (req.query.saldo) {

            saldo = req.query.saldo
            const contaCorrente = await Bank.findOne({
                where: {
                    UserId: req.session.userid,
                    id: id,
                },
                raw: true
            })

            console.log(contaCorrente.contacorrente)

            res.render('bancos/contaCorrente', {
                id , saldo : contaCorrente.contacorrente
            })
            return
        }
        res.render('bancos/contaCorrente', {
            id, saldo
        })

    }

    static async contaCorrentePost(req, res) {
        const bankId = req.body.id
        console.log(bankId)

        const {
            deposit,
            withdraw,
            balance,
        } = req.body

        if (deposit) {
            try {
                await Bank.increment({
                    contacorrente: deposit
                }, {
                    where: {
                        id: bankId,
                        UserId: req.session.userid
                    }
                })

                req.flash('message', `Foi adicionado R$${deposit} a sua conta`)

            } catch (error) {
                console.log('Não foi possivel depositar o valor a conta ' + error)

            }


            req.session.save(() => {
                res.render(`bancos/contacorrente`, {
                    id: bankId
                })
            })
            return
        }

        if (withdraw) {

            try {
                const contaCorrente = await Bank.findOne({
                    raw: true,
                    where: {
                        id: bankId,
                        UserId: req.session.userid,
                    }
                })

                const saldo = parseFloat(contaCorrente.contacorrente)
                const Withdraw = parseFloat(withdraw)
                console.log(saldo)
                console.log(Withdraw)



                if (saldo < Withdraw) {
                    req.flash('message', 'Voce não tem saldo suficiente')
                    res.render('bancos/contacorrente', {
                        id: bankId
                    })
                    return
                }


                await Bank.decrement({
                    contacorrente: withdraw
                }, {
                    where: {
                        id: bankId,
                        UserId: req.session.userid,
                    }
                })
                req.flash('message', `Foi sacado R$${withdraw} de sua conta`)
            } catch (error) {
                console.log('Não foi possivel processsar seus dados ' + error)
            }

            req.session.save(() => {
                res.render('bancos/contaCorrente', {
                    id: bankId
                })
            })
            return
        }

        if (balance) {


        }
    }

    static async contaPoupanca(req, res) {
        const id = req.params.id

        console.log('Id na conta Poupanca ' + id)

        let depositar = '',
            sacar = '',
            saldo = ''

        if (req.query.depositar) {
            depositar = req.query.depositar
            res.render(`bancos/contaPoupanca`, {
                depositar,
                id
            })
            return
        }
        if (req.query.sacar) {
            sacar = req.query.sacar
            res.render('bancos/contaPoupanca', {
                sacar,
                id
            })
            return
        }
        if (req.query.saldo) {

            saldo = req.query.saldo
            const contaPoupanca = await Bank.findOne({
                where: {
                    UserId: req.session.userid,
                    id: id,
                },
                raw: true
            })

            console.log(contaPoupanca.contapoupanca)

            res.render('bancos/contaCorrente', {
                id , saldo : contaPoupanca.contapoupanca
            })
            return
        }
        res.render('bancos/contaPoupanca', {
            id, saldo
        })
    }

    static async contaPoupancaPost(req, res) {
        const bankId = req.body.id
        console.log(bankId)

        const {
            deposit,
            withdraw,
            balance,
        } = req.body

        if (deposit) {
            try {
                await Bank.increment({
                    contapoupanca: deposit
                }, {
                    where: {
                        id: bankId,
                        UserId: req.session.userid
                    }
                })

                req.flash('message', `Foi adicionado R$${deposit} a sua conta`)

            } catch (error) {
                console.log('Não foi possivel depositar o valor a conta ' + error)

            }


            req.session.save(() => {
                res.render(`bancos/contaPoupanca`, {
                    id: bankId
                })
            })
            return
        }

        if (withdraw) {

            try {
                const contaPoupanca = await Bank.findOne({
                    raw: true,
                    where: {
                        id: bankId,
                        UserId: req.session.userid,
                    }
                })

                const saldo = parseFloat(contaPoupanca.contapoupanca)
                const Withdraw = parseFloat(withdraw)
                console.log(saldo)
                console.log(Withdraw)



                if (saldo < Withdraw) {
                    req.flash('message', 'Voce não tem saldo suficiente')
                    res.render('bancos/contaPoupanca', {
                        id: bankId
                    })
                    return
                }


                await Bank.decrement({
                    contapoupanca: withdraw
                }, {
                    where: {
                        id: bankId,
                        UserId: req.session.userid,
                    }
                })
                req.flash('message', `Foi sacado R$${withdraw} de sua conta`)
            } catch (error) {
                console.log('Não foi possivel processsar seus dados ' + error)
            }

            req.session.save(() => {
                res.render('bancos/contaPoupanca', {
                    id: bankId
                })
            })
            return
        }

        if (balance) {


        }
    }


}

function getRandom() {
    let max = 89999
    let min = 10000
    return Math.floor(Math.random() * max + min)
}