const utility = require('./../other/utility');
const Hub = require('../../models/Hub')
const User = require('../../models/User')

exports.getHubs = (req, res) => {
   Hub
      .find()
      .populate('scenario')
      .exec((err, hubs) => {
         res.json({data: hubs})
      })
}

exports.getMyHub = (req, res) => {
   Hub
      .findOne({members: req.params.id})
      //.populate('rooms scenario members')
      .populate({
         path: 'rooms members scenario',
         poplulate: {
            path: 'tasks'
         },
         select: {hash: 0}
      })
      .exec((err, user) => {
         console.log('User ', user)
         //res.send({data: user && user.currentHub || {}})
         res.send({data: user})
         //console.log(user.currentHub)
      })
}
