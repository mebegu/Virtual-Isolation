const User = require('../models/User')

module.exports.getUserByToken = token => {
   let user
   try {
      user = User.verifyJwt(token)
   } catch(err) {
      console.error(err)
      return
   }
   return user
}
