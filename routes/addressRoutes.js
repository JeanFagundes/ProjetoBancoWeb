const express = require ('express')
const router = express.Router()
const AddressController = require('../controllers/AddressController')

router.get('/registerAddress', AddressController.registerAddress)
router.post('/registerAddress', AddressController.registerAddressPost)

module.exports = router