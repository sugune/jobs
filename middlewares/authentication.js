const jwt = require('jsonwebtoken');
const {
  UnauthenticatedError
} = require('../errors');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('access denied: invalid token storing || no token provided');
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {name: payload.name, userId: payload.userId};
    next();
  } catch (err) {
    console.log(err)
    throw new UnauthenticatedError('Invalid token');
  }
  
}

module.exports = auth