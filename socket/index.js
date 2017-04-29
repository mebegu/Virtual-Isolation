const User = require('../models/User')

module.exports = server => {
   const io = require('socket.io')(server)
   io.on('connection', client => {
      console.log('Client connected')
      require('./roomEvents')(io, client)
      require('./hubEvents')(io, client)
   })
   console.log('Socket created...')
   return io
}
