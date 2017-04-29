module.exports.getUserByToken = token => {
   let user
   try {
      user = User.verifyJwt(data.token)
   } catch(err) {
      console.error(err)
      return
   }
   return user
}
