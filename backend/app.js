import express from 'express'
const app = express();             // express is used
app.use(express.json())

import bodyParser from "body-parser";
import fileUpload from "express-fileupload";

import cors from 'cors'
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));     // Cors

import cookieParser from 'cookie-parser';    // To access user cookie 
app.use(cookieParser())                      // when user login user can see all products

app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// import route

import product from './routes/product.route.js';
app.use("/api/v1",product) 

import user from './routes/user.route.js';
app.use("/api/v1",user) 

import order from './routes/order.route.js';
app.use("/api/v1",order) 



export {app}