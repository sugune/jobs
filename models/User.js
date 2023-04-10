const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: 50
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    maxlength: 20
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
      'Please provide a valid email']
  }
});

userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt)
  next();
});

userSchema.methods.createJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '30d'});
  return token;
}

userSchema.methods.comparePassword = async function(candidatePassword) {
  const isValid = await bcrypt.compare(candidatePassword, this.password);
  return isValid;
}

module.exports = mongoose.model('user', userSchema);