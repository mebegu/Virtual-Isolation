const mongoose = require('mongoose');
const jsonwebtoken = require('jsonwebtoken');
const config = require('./../config.json');
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
  role:  {type: String , required: true, unique: true}
});

const UserSchema = new Schema({
  username:  {type: String , required: true, unique: true},
  name:      {type: String , required: false},
  surname:   {type: String , required: false},
  email:     {type: String , required: true, unique: true},
  date:      {type: Date   , default: Date.now},
  photo:     {type: String},
  hash:      {type: String, required: true},
  role:      {type: RoleSchema}
});


UserSchema.methods.generateJwt = function() {
  return jsonwebtoken.sign({
    _id:      this._id,
    username: this.username
  }, (process.env.MY_TOKEN || config.JWTSecret), { expiresIn: config.JWTExpiration });
};

UserSchema.statics.verifyJwt = function (token) {
   return jsonwebtoken.verify(roken, process.env.MY_TOKEN || config.JWTSecret)
}

module.exports = mongoose.model('User', UserSchema);
