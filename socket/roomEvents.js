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
                  { new: true, populate: {
                        path: 'equipments'
                  }})
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
                  io.to(data.roomId).emit('room:joined', {
                     message: 'Joined',
                     user,
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
      const payload = {
         _id: String(Date.now()) + String(Math.random()).substr(2,5),
         message: data.message,
         sendedAt: Date.now().toString()
      }
      io.to(data.roomId).emit('room:messaged', {
         sender: user,
         payload: data.payload
      })
   })
}
