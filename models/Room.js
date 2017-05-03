const mongoose = require('mongoose');
const config = require('./../config.json');
const Schema = mongoose.Schema;


const RoomSchema = new Schema({
  users:       [{type: mongoose.SchemaTypes.ObjectId}],
  label:        {type: String , required: false},
  date:         {type: Date   , default: Date.now},
  type:         {type: mongoose.SchemaTypes.ObjectId},
  equipments:  [{type: mongoose.SchemaTypes.ObjectId}],
  capacity:    {type: Number, default: 5},
  sayi:        {type: Number}
});



module.exports = mongoose.model('Room', RoomSchema);
