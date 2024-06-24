import express from 'express';
import router from './routes/route';
import productrouter from './routes/product';
import connectUserDB from './db';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app = express();

// Express Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Connect to database
connectUserDB();

// User router
app.use(router);
app.use(productrouter);

// Specify port
// const port = 8000;

// Start the server on port
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
