const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  testname: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model('test', testSchema);
