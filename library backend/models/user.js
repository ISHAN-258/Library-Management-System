const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String, 
    required: true,
  },
  role:{
    type:String,
    default:'student'
  }
});

module.exports = mongoose.model('User', UserSchema);
