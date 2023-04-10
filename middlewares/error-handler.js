const StatusCodes = require('http-status-codes');

const errorHandlerMiddleware = async (err, req, res, next) => {
  let customError = {
    message: err.message,
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  }
  
  if (err.name === 'CastError') {
    customError.statusCode = 404,
    customError.message = `there is no item with an id of ${err.value._id}`
  }
  
  if (err.name === 'ValidationError') {
    customError.message = Object.values(err.errors).map(item => item.message).join(',');
    customError.statusCode = StatusCodes.BAD_REQUEST
  }
  
  if (err.code === 11000) {
    customError.message = `Duplicate value for ${Object.keys(err.keyValue)} field, please provide another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  
  console.log(err)
  //res.json({err})
  res.status(customError.statusCode).json({message: customError.message});
}

module.exports = errorHandlerMiddleware;