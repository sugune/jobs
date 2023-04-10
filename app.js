require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

// modules
const connectDB = require('./db/connect');
const notFoundMiddleware = require('./middlewares/not-found')
const errorHandler = require('./middlewares/error-handler');
const authenticateUser = require('./middlewares/authentication');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// routers
const authRouter = require('./routers/auth');
const jobsRouter = require('./routers/jobs');

// middlewares

app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100
}))
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(cors())

// routes
app.get('/', (req, res) => {
  res.send('i love myka')
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

// errors 
app.use(notFoundMiddleware);
app.use(errorHandler);



const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`server is listening on PORT ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

start();