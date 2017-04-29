const Room = require('../models/Room');
const User = require('../models/User');
const getUserByToken = require('./utils').getUserByToken

module.exports = (io, client) => {
   let _rooms = []
   let _equipments = []
   client.on('room:enter', data => {
      const user = getUserByToken(data.token)
      if (!user) {
         return
      }
      Room
         .update({users: user._id}, {$pull: {users: user._id}}, {multi: true})
         .exec((err, res) => {
            if (err) {
               console.error(err)
               return
            }
            console.log('Update result from room joining ', res)
            _rooms.forEach(r => client.leave(r))
            _rooms = []
            Room
               .findByIdAndUpdate(
                  data.roomId,
                  { $push: {users: user._id} },
                  { new: true })
               .exec((err, room) => {
                  if (err) {
                     console.error(err)
                     return err
                  }

                  if (!room) {
                     client.emit('error', {
                        message: 'Room yoh!',
                        data
                     })
                     return
                  }
                  const rid = room._id.toString()
                  client.join(rid)
                  _rooms.push(rid)
                  client.emit('info', {
                     message: 'Joined',
                     data: room
                  })
               })
         })
   })

   client.on('room:message', data => {
      const user = getUserByToken(data.token)
      if (!user) {
         return
      }
      io.to(data.roomId).emit('message', {
         sender: user,
         payload: data.payload
      })
   })
}
