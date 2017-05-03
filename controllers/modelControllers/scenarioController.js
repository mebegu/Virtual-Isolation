const Scenario = require('../../models/Scenario');


exports.scenario = (req, res) => {
   Scenario
      .find()
      .populate('tasks')
      .exec((err, s) => {
         res.send({data: err || s})
      })
}
