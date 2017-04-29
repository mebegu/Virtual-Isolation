const mongoose = require('mongoose');
const config = require('./../config.json');
const Schema = mongoose.Schema;


const EquipmentSchema = new Schema({
  label:        [{type: mongoose.SchemaTypes.ObjectId}],
  description:   {type: String , required: false},
  relatedTasks: [{type: mongoose.SchemaTypes.ObjectId}],
  lastMaintanence: {type: Date, default: Date.now},
  repairTime:     Number,
  detCoef:       {type: Number, defualt: 1000},
  size:          Number,
  useCoef:       {type: Number, defualt: 1},
});

EquipmentSchema.statics.getCondition = function (doc) {
   return Math.max(100 - (Date.now() - doc.lastRepairDate) / doc.detCoef, 0)
}

EquipmentSchema.post('init', doc => {
   doc.condition = EquipmentSchema.statics.getCondition(doc)
})


module.exports = mongoose.model('Equipment', EquipmentSchema);
