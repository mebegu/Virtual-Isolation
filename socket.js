module.exports = server => {
   const io = require('socket.io')(server)
   io.on('connection', client => {
      console.log('Client connected')

      client.on('enterRoom', data => {

      })
      client.on('message', data => {
         console.log(data)
      })
   })
   console.log('Socket created...')
   return io
}
