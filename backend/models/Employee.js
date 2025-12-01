const mongoose = require('mongoose');
const empSchema = new mongoose.Schema({
  name: String,
  employeeCode: {type:String, unique:true},
  department: String,
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'}
});
module.exports = mongoose.model('Employee', empSchema);
