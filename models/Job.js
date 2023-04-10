const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Please provide a company name'],
    maxlength: 25
  },
  position: {
    type: String,
    required: [true, 'Please provide a position']
  }, 
  status: {
    type: String,
    enum: ['interview', 'pending', 'declined'],
    default: 'pending'
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    require: [true, 'Please provide a user']
  }
}, {timestamps: true});

module.exports = mongoose.model('job', jobSchema);