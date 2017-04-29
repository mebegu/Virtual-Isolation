const mongoose = require('mongoose');
const config = require('./../config.json');
const Schema = mongoose.Schema;


const TaskSchema = new Schema({
  label:        {type: String, required: true},
  description:   {type: String , required: false},
  startDate:     {type: Date},
  duration:      Number,
  users:        [{type: mongoose.SchemaTypes.ObjectId}],
  random:        {type: Boolean, default: false},
  completed:     {type: Boolean, default: false},
  completionDate:Date,
  deadline:       Number,
  failed:        {type: Boolean, default: false},
  equipments:  [{type: mongoose.SchemaTypes.ObjectId}],
});


module.exports = mongoose.model('Task', TaskSchema);
