const User = require('../models/User')

module.exports =  {
    async teste(){
        const lastid = await User.findOne({
            order: [ [ 'createdAt', 'DESC' ]],
        });
       // const userrr = lastid.id
        return lastid.id
    }
}