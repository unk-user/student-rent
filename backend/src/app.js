const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const privateRoutes = require('./routes/privateRoutes');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api/home', privateRoutes);

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

app.listen(process.env.PORT, () => {
  console.log(`app started on port: ${process.env.PORT}`);
});
