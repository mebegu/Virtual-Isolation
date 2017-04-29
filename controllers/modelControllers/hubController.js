const utility = require('./../other/utility');
const Hub = require('../../models/Hub')

exports.getHubs = (req, res) => {
   Hub
      .find()
      .populate('scenario')
      .exec((err, hubs) => {
         res.json({data: hubs})
      })
}

exports.getMyHub = (req, res) => {
   User
      .findById(req.params._id)
      .populate('currentHub currentHub.scenario currentHub.scenario.tasks currentHub.rooms currentHub.members')
      .exec((err, user) => {
         res.send(user && user.currentHub || {})
      })
}
