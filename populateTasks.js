const Task = require('./models/Task')

const tasks = require('./tasks.json')

Promise.all(tasks.map(t => {
   const task = new Task(t)
   if (t.deadline <= 0) {
      console.log('here...')
      return task.save()
   }
}))
.then(() => console.log('Tasks are poplulated'))
.catch(err => console.error(err))
