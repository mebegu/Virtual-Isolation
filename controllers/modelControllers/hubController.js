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
      .findById(req.user._id)
      .populate('currentHub')
      .exec((err, user) => {
         res.send(user && user.currentHub || {})
      })
}
