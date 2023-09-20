import express from 'express';
import {APP_PORT, DB_URL} from './config/index.js';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

//Database connection
mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
const db= mongoose.connection;

db.on('error', ()=>{
    console.error( 'DB connection error');
});

db.once('open', ()=>{
    console.log('DB conneced...');
});


const app= express();
                                             

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);                    // __dirname (current root folder)
global.appRoot = __dirname;                               // root folder path register globally in appRoot variable


app.use(express.urlencoded({extended:false}))            // for multipart data 
app.use(express.json());              // give ability to read json data send in request body
app.use('/api', routes);               // here /api is prefix endpoint and needed to add in every url
app.use('/uploads', express.static('uploads'));                  // inbuilt middleware , when /uploads url hit then fetch data from static folder uploads

app.use(errorHandler);
app.listen(APP_PORT, ()=>console.log(`Listening on port ${APP_PORT}`));