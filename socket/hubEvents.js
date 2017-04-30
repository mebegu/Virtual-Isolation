const Hub = require('../models/Hub')
const Room = require('../models/Room')
const User = require('../models/User')
const getUserByToken = require('./utils').getUserByToken
const errorCodes = require('./errorCodes.json')

module.exports = (io, client) => {
   let currentHub
   let getChannel = () => 'hub/'+currentHub._id.toString()

   function setupOthers() {
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
               io.to(getChannel()).emit('hub:addRoom', room)
            })
            .catch(err => {
               console.error(err);
            })
         })

         client.on('hub:leave', data => {
            const me = getUserByToken(data.token)
            if (!me) {
               return
            }
            Hub
               .update({_id: currentHub._id}, {$pull: {members: me._id}}).exec()
               .then(() => User.findByIdAndUpdate(me._id, {currentHub: null}).exec())
               .then(() => {
                  currentHub = undefined
                  io.to(getChannel()).emit('hub:leaved', me)
                  client.leave(getChannel())
               })
               .catch(err => {
                  console.error(err);
                  client.emit('error', {code: errorCodes.DBError})
               })
         })

         client.on('hub:start', data=>{
            Hub.update({_id: currentHub._id}, {started: true}, {}, (err, res)=>{
               if (!err && res.nModified) {
                  io.to(getChannel()).emit('hub:started')
               }
            })
         })

         client.on('hub:message', data=>{
            console.log('Hub message received: ', data.message);
            const me = getUserByToken(data.token)
            if (!me) {
               return
            }
            const payload = {
               _id: String(Date.now()) + String(Math.random()).substr(2,5),
               message: data.message,
               sendedAt: (new Date()).toUTCString()
            }
            io.to(getChannel()).emit('hub:messaged', {sender: me, payload})
            console.log('Hub message sent: ', payload);
         })
      }

      client.on('hub:join', data => {
         console.log('Hub join request...')
         const me = getUserByToken(data.token)
         if (!me) {
            console.error(':(0)')
            return
         }
         console.log(me, data)
         Hub
            .findById(data.hubId)
            .exec((err, hub) => {
               if (err) {
                  return console.error(err);
               }
               if(!hub) {
                  return console.error('NoHub')
               }
               let sz = hub.members.length
               hub.members.addToSet(me._id)
               if (sz != hub.members.length && hub.started) {
                  client.emit('error', {code: errorCodes.MissionStarted})
                  return
               }
               hub.save(err => {
                  console.error(err || 'saved');
                  if (err) {
                     return socket.emit('error', {code: errorCodes.DBError})
                  }
                  Hub.update({_id: {$ne: data.hubId}}, {$pull: {members: me._id}}).exec()
                  User.findByIdAndUpdate(me._id, {currentHub: hub})
                     .exec()
                     .then(() => {
                        currentHub = hub
                        client.join(getChannel())
                  //client.emit('hub:join', {hub, user:me})
                        io.to(getChannel()).emit('hub:join', {hub, user:me})
                        console.log('Joined...')
                        setupOthers()
                     })
                     .catch(err => console.error(err))
                  })
            })
         })
}
