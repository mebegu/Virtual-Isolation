const Hub = require('../models/Hub')
const Room = require('../models/Room')
const User = require('../models/User')
const Task = require('../models/Task')
const Scenario = require('../models/Scenario')
const getUserByToken = require('./utils').getUserByToken
const errorCodes = require('./errorCodes.json')

module.exports = (io, client) => {
   let currentHub
   let getChannel = () => 'hub/'+currentHub._id.toString()
   let chosenOnes = {}
   let _tasks

   function setupOthers() {
      client.on('hub:addRoom', data => {
         console.log('Add room ', data)

         const room = new Room(data)
         room.label = String(Math.random())
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
            console.log("Started ", data)
            Hub.findOneAndUpdate({_id: currentHub._id}, {started: true}, {new: true}, (err, hub)=>{
               if (err || !hub) {
                  return
               }
               io.to(getChannel()).emit('hub:started')
               //Setup the task creation system
               function random (low, high) {
                  return Math.random() * (high - low) + low;
               }
               Scenario
                  .findById(hub.scenario)
                  .exec((err, scenario) => {
                     Task
                        .find({$or: [
                           {random: true}, {_id: {$in: scenario.tasks}}
                        ]})
                        .exec((err, tasks) => {

                           chosenOnes = {}
                           _tasks = []
                           setInterval(() => {
                              try {
                                 let index, task
                                 if (Object.keys(chosenOnes).length < tasks.length) {
                                    index = Math.floor(random(0, tasks.length-1))
                                    task = tasks[index]
                                    console.log(task, ' ', index, ' ', tasks.length)
                                    while (chosenOnes[task && task._id && task._id.toString()]) {
                                       index = random(0, tasks.length-1)
                                       task = tasks[index]
                                    }
                                 } else { return; }
                                 if (!task.random) {
                                    chosenOnes[task._id.toString()] = true
                                 }
                                 const _task = Object.assign({}, task.toObject())
                                 _task._id = _task._id.toString() + String(Math.random())
                                 _task.startDate = new Date()
                                 _tasks.push(_task)
                                 io.to(getChannel()).emit('hub:newTask', _tasks)
                              } catch(err) {
                                 console.error(err)
                              }
                           }, 2000)
                        })
                  })
            })
         })

         client.on('hub:taskComplete', data => {
            const task = _tasks.find(t=>t._id.toString() === _id)
            task.completed = true
            io.to(getChannel()).emit('hub:taskCompleted', task)
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
                  //client.emit('error', {code: errorCodes.MissionStarted})
                  return
               }
               hub.save(err => {
                  console.error(err || 'saved');
                  if (err) {
                     return socket.emit('error', {code: errorCodes.DBError})
                  }
                  currentHub = hub
                  client.join(getChannel())
                  io.to(getChannel()).emit('hub:join', {hub, user:me})
                  console.log('Joined...')
                  Hub.update({_id: {$ne: data.hubId}}, {$pull: {members: me._id}}).exec()
                  User.findByIdAndUpdate(me._id, {currentHub: hub})
                     .exec()
                     .then(() => {
                           setupOthers()
                  //client.emit('hub:join', {hub, user:me}
                     })
                     .catch(err => console.error(err))
                  })
            })
         })
}
