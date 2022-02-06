const express = require ('express')
const router = express.Router()
const BankController = require ('../controllers/BankController')

router.get('/', BankController.showBanks)

module.exports = router