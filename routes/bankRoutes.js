const express = require ('express')
const router = express.Router()
const BankController = require ('../controllers/BankController')
const modulo = require('../helpers/modulos')

router.get('/', BankController.showBanks)

router.get('/registerAgencia', BankController.registerAgencia)
router.post('/registerAgencia', BankController.registerAgenciaPost)

router.get('/contaCorrente', modulo.checkAuth, BankController.contaCorrente)
router.post('/contaCorrente', modulo.checkAuth, BankController.contaCorrentePost)

module.exports = router