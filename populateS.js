const Scenario = require('./models/Scenario')

const tasks = require('./scenario')

Promise.all(tasks.map(t => {
   const eq = new Scenario(t)
   console.log('there...')
   return eq.save()

}))
.then(() => console.log('Scenarios are poplulated'))
.catch(err => console.error(err))
