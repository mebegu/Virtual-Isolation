const Hub = require('../models/Hub');
const Room = requite('../models/Room')
const getUserByToken = require('./utils').getUserByToken

module.exports = (io, client) => {
   let currentHub
   let getChannel = () => 'hub/'+currentHub._id.toString()

   client.on('hub:join', data => {
      const me = getUserByToken(data.token)
      if (!me) {
         console.error('(o)))')
         return
      }
      Hub
         .findOneAndUpdate(
            {_id: data.hubId, started: false},
            {$addToSet: {users: me._id}},
            {new: true},
            (err, hub) => {
               if (err) {
                  return console.error(err);
               }
               if (!hub) {
                  console.error('Hub not found')
                  return
               }
               currentHub = hub
               client.join(getChannel())
               io.to(getChannel()).emit('hub:joined', {hub, user:me})
            }
         )
   })

   client.on('hub:addRoom', data => {
      const room = new Room(data.room)
      room
         .save()
         .then(room => {
            return Hub.findOneAndUpdate(
               {_id: currentHub._id, started: false},
               {$addToSet: {rooms :room._id}}
            ).exec()
         })
         .then(hub => {
            if (!hub) {
               return
            }
            io.to(getChannel()).emit('hub:newRoom', room)
         })
         .catch(err => {
            console.error(err);
         })
   })

   client.on('hub:start', data=>{
      Hub.update({_id: currentHub._id}, {started: true}, {}, (err, res)=>{
         if (!err && res.nModified) {
            io.to(getChannel()).emit('hub:started', hub)
         }
      })
   })

   client.on('hub:message', data=>{
      const me = getUserByToken(data.token)
      if (!me) {
         return
      }
      io.to(getChannel()).emit('hub:message', {sender: me, payload: data.payload})
   })
}
