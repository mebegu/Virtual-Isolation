const mongoose = require('mongoose');
const config = require('./../config.json');
const Schema = mongoose.Schema;


const TaskSchema = new Schema({
  title:        [{type: mongoose.SchemaTypes.ObjectId}],
  description:   {type: String , required: false},
  date:          {type: Date   , default: Date.now},
  progress:      {type: mongoose.SchemaTypes.ObjectId},
  users:        [{type: mongoose.SchemaTypes.ObjectId}]
});



module.exports = mongoose.model('Task', TaskSchema);