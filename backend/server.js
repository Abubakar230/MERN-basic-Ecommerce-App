import connectDB from './db/db.js';
import { app } from './app.js';   // app.js import

import {v2 as cloudinary} from 'cloudinary';

import dotenv from 'dotenv'       // dotenv import
dotenv.config({path:"backend/.env"})


const port = process.env.PORT || 5666;       // port



// mongo db connection
connectDB()
.then(()=>{
    app.listen(port, ()=>{
        console.log(`this port is running in ${port}`)
    })
})
.catch((err)=>{
    console.log(`This port is not working yet mongodb connection is also failed :`,err)
})


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME , 
    api_key: process.env.CLOUDINARY_API_KEY , 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });