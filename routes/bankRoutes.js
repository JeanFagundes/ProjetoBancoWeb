const express = require ('express')
const router = express.Router()
const BankController = require ('../controllers/BankController')
const modulo = require('../helpers/modulos')

router.get('/', BankController.showBanks)

router.get('/registerAgencia', BankController.registerAgencia)
router.post('/registerAgencia', BankController.registerAgenciaPost)

router.get('/contaCorrente/:id', modulo.checkAuth, BankController.contaCorrente)
router.post('/contaCorrente', modulo.checkAuth, BankController.contaCorrentePost)

router.get('/contaPoupanca/:id', modulo.checkAuth, BankController.contaPoupanca)
router.post('/contaPoupanca', modulo.checkAuth, BankController.contaPoupancaPost)

module.exports = router