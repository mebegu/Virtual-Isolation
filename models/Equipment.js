const mongoose = require('mongoose');
const config = require('./../config.json');
const Schema = mongoose.Schema;


const EquipmentSchema = new Schema({
  label:        [{type: mongoose.SchemaTypes.ObjectId}],
  description:   {type: String , required: false},
  relatedTasks: [{type: mongoose.SchemaTypes.ObjectId}],
  lastRepairDate: {type: Date, default: Date.now},
  useTime:        Number,
  repairTime:     Number,
  detCoef:       {type: Number, defualt: 1000}
});

EquipmentSchema.statics.getCondition = function (doc) {
   return Math.max(100 - (Date.now() - doc.lastRepairDate) / doc.detCoef, 0)
}

EquipmentSchema.post('init', doc => {
   doc.condition = EquipmentSchema.statics.getCondition(doc)
})


module.exports = mongoose.model('Equipment', EquipmentSchema);
