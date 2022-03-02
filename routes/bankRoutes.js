const express = require ('express')
const router = express.Router()
const BankController = require ('../controllers/BankController')

router.get('/', BankController.showBanks)

router.get('/registerAgencia', BankController.registerAgencia)
router.post('/registerAgencia', BankController.registerAgenciaPost)

module.exports = router