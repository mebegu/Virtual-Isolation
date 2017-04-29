const mongoose = require('mongoose');
const config = require('./../config.json');
const Schema = mongoose.Schema;


const TaskSchema = new Schema({
  title:        [{type: mongoose.SchemaTypes.ObjectId}],
  description:   {type: String , required: false},
  date:          {type: Date   , default: Date.now},
  duration:      Number,
  users:        [{type: mongoose.SchemaTypes.ObjectId}],
  random:        {type: Boolean, default: false},
  completed:     {type: Boolean, default: false},
  completionDate:Date,
  deadline:       Date
});

module.exports = mongoose.model('Task', TaskSchema);
