export default (server) => {
   const io = require('socket.io')(server)
   io.on('connection', client => {
      console.log('Client connected')
   })
}
