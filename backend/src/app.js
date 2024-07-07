const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const userRouter = require('./routes/userRouter');
const landlordRouter = require('./routes/ownerRoutes');
const clientRouter = require('./routes/clientRoutes');
const uploadRouter = require('./routes/uploadRouter');
const configureSocket = require('./config/socket');
require('dotenv').config();

const app = express();
const server = require('http').createServer(app);

connectDB();

app.use(express.json());
app.use(
  cors({
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    origin: ['http://localhost:8000', 'http://localhost:5173'],
  })
);

app.use(morgan('dev'));
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api/user', userRouter);
app.use('/api/landlord', landlordRouter);
app.use('/api/client', clientRouter);
app.use('/api/upload', uploadRouter);

app.use((req, res, next) => {
  const error = new Error('not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

const io = configureSocket(server);

app.set('io', io);

server.listen(process.env.PORT, () => {
  console.log('Server started on port', process.env.PORT);
});

module.exports = app;
