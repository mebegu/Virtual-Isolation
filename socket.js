module.exports = server => {
   const io = require('socket.io')(server)
   io.on('connection', client => {
      console.log('Client connected')
   })
   console.log('Socket created...')
}
