const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const userRouter = require('./routes/userRouter');
const landlordRouter = require('./routes/landlordRoutes');
const studentRouter = require('./routes/studentRoutes');
const Conversation = require('./models/Conversation');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const server = require('http').createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
  },
});

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
app.use('/api/me', userRouter);
app.use('/api/landlord', landlordRouter);
app.use('/api/student', studentRouter);

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
});

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
