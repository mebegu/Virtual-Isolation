const User = require('./../../models/User');
const utility = require('./../other/utility.js');
const bcrypt = require('bcrypt');
const config = require('./../../config.json');
const parseQueryOptions = utility.parseQueryOptions;
const isEmpty = utility.isEmpty;
const respond = utility.respond;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;


exports.create = function (req, res, next) {
  console.log('User Application Received');
  console.log(req.body);
  let object = {
    username: req.body.username,
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    photo: req.body.photo
  };
  let password = req.body.password;
  if (isEmpty(object.username) || isEmpty(object.email) || isEmpty(password))
    return respondBadRequest(res);

  let rounds = parseInt(config.saltRounds);
  bcrypt.hash(password, rounds).then(function (hash) {
    object.hash = hash;
    console.log(object);
    const data = new User(object);
    data.save((err) => {
      return respondQuery(res, err, data._id, 'New User', 'Applied');
    });
  });

};

exports.edit = function (req, res, next) {
  console.log("Edit User Request Recevied");
  let query = {
    _id: req.body._id
  };
  let upt = {
    set: {
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      photo: req.body.photo,
      message: req.body.message
    }
  };

  if (isEmpty(query._id) || isEmpty(upt.email))
    return respondBadRequest(res);

  User.findByIdAndUpdate(query, upt, {
      new: true
    },
    function (err, data) {
      return respondQuery(res, err, data._id, 'User', 'Edited');
    });
};
