const mongoose = require('mongoose');
const config = require('./../config.json');
const Schema = mongoose.Schema;


const TaskSchema = new Schema({
  title:        [{type: mongoose.SchemaTypes.ObjectId}],
  description:   {type: String , required: false},
  startDate:     {type: Date},
  duration:      Number,
  users:        [{type: mongoose.SchemaTypes.ObjectId}],
  random:        {type: Boolean, default: false},
  completed:     {type: Boolean, default: false},
  completionDate:Date,
  deadline:       Number,
  failed:        {type: Boolean, default: false}
});


module.exports = mongoose.model('Task', TaskSchema);
