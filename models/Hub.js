const mongoose = require('mongoose');
const config = require('./../config.json');
const Schema = mongoose.Schema;


const HubSchema = new Schema({
  members:    [{type: mongoose.SchemaTypes.ObjectId, ref: 'User'}],
  rooms:       [{type: mongoose.SchemaTypes.ObjectId, ref: 'Room'}],
  label:      {type: String , required: true},
  date:       {type: Date   , default: Date.now},
  scenario:    {type: mongoose.SchemaTypes.ObjectId, ref:'Scenario'},
  started:     {type: Boolean, default: false},
});

HubSchema.post('init', doc => {
   doc.room = undefined
})

module.exports = mongoose.model('Hub', HubSchema);
