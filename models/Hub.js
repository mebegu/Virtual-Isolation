const mongoose = require('mongoose');
const config = require('./../config.json');
const Schema = mongoose.Schema;


const HubSchema = new Schema({
  members:     [{type: mongoose.SchemaTypes.ObjectId}],
  room:     [{type: mongoose.SchemaTypes.ObjectId}],
  label:     {type: String , required: false},
  date:      {type: Date   , default: Date.now},
  task:     [{type: String}]
});



module.exports = mongoose.model('Hub', HubSchema);