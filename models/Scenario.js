const mongoose = require('mongoose');
const config = require('./../config.json');
const Schema = mongoose.Schema;

const ScenarioSchema = new Schema({
   title: {type: String, required: true},
   description: String,
   crewSize: Number,
   tasks: [{type: mongoose.SchemaTypes.ObjectId}],
   duration: Number
})

module.exports = mongoose.model(ScenarioSchema)
