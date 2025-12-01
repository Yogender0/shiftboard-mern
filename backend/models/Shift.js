const mongoose = require('mongoose');
const shiftSchema = new mongoose.Schema({
  employee: {type: mongoose.Schema.Types.ObjectId, ref:'Employee', required:true},
  date: {type: String, required:true}, // YYYY-MM-DD
  startTime: {type: String, required:true}, // HH:MM
  endTime: {type: String, required:true} // HH:MM
});

module.exports = mongoose.model('Shift', shiftSchema);
