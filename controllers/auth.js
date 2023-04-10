const User = require('../models/User');
const StatusCodes = require('http-status-codes');
const {
  BadRequestError,
  UnauthenticatedError
} = require('../errors');

const register = async (req, res) => {
  const user = await User.create(req.body)
  const token = user.createJWT({name: user.name, userId: user._id});
  res.status(StatusCodes.CREATED).json({name: user.name, token});
}

const login = async (req, res) => {
  const {email, password} = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide email AND password');
  }
  
  const user = await User.findOne({email});
  if (!user) {
    console.log('error')
    throw new UnauthenticatedError('Invalid Credentials');
  }
  
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new UnauthenticatedError('Invalid Credentials');
  }
  
  const token = user.createJWT({name:user.name, userId: user._id});
  res.status(StatusCodes.OK).json({name:user.name, token});
}


module.exports = {
  register,
  login
}