const Bank = require('../models/Bank')
const User = require('../models/User')

module.exports = class BankController {

    static async showBanks(req, res) {
        res.render('bancos/home')
    }
}