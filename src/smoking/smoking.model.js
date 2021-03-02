const { Schema, model } = require('mongoose');

const smokingSchema = new Schema({
  userId: { type: String, required: true },
  timestamp: { type: Number, required: true }
});

const smokingModel = model('Smoking', smokingSchema);

module.exports = smokingModel;