const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const privateRoutes = require('./routes/privateRoutes')

const dotenv = require('dotenv');
dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use(cors());
app.use(morgan());

app.use('/api', authRoutes);
app.use('/api/home', privateRoutes);

app.listen(process.env.PORT, () => {
  console.log(`app started on port: ${process.env.PORT}`);
});
