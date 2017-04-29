const mongoose = require('mongoose');
const config = require('./../config.json');
const Schema = mongoose.Schema;


const EquipmentSchema = new Schema({
  label:        [{type: mongoose.SchemaTypes.ObjectId}],
  description:   {type: String , required: false},
  relatedTasks: [{type: mongoose.SchemaTypes.ObjectId}],
  condition:     {type: Number , required: false}
});



module.exports = mongoose.model('Equipment', EquipmentSchema);