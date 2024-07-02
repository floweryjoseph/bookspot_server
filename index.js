import express from 'express';
import bodyParser from 'body-parser';
import  mongoose from  'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
const app = express();

app.use(helmet());
app.use(cors({origin:true}))
dotenv.config();

app.use(morgan("dev"))

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json())

 app.use("/auth", authRoutes)
 app.use('/user', userRoutes)


mongoose.connect(process.env.MONGO_URL).then(()=>{
    app.listen(process.env.PORT, ()=>{
        console.log("Server listening on port " + process.env.PORT)
    })
}).catch(()=>console.log("Database connection Error!!"))