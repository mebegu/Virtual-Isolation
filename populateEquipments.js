const Equipment = require('./models/Equipment')

const tasks = require('./equipments')

Promise.all(tasks.map(t => {
   const eq = new Equipment(t)
   console.log('here...')
   return eq.save()

}))
.then(() => console.log('Tasks are poplulated'))
.catch(err => console.error(err))
