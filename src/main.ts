import express from "express";
import dotenv from "dotenv";
import path from 'path';
import mongoose  from 'mongoose';
import cors from "cors";
import { router as apiRouter} from './router/apiRoutes';
import { router as renderRoutes} from './router/rederRoutes';
import ErrorMeddileware from './meddileware/error';
import helmet from "helmet";
import morgan from "morgan";
import { rateLimit } from 'express-rate-limit';
import compression from "compression"



const app=express();
const mongoURI = process.env.URL_DB as string;

dotenv.config();


// we use this meddileware for solve post Requist to match data of resquit for same header "application/json"
// the default value application/json
// it execute for all app  
app.use(express.json());

app.use(cors());


// we use it to provide the attacks accourding header
app.use(helmet({
    // to solve show image problem
    contentSecurityPolicy:{
        directives:{
            "default-src": ["'self'"],
            "script-src": ["'self'", "'unsafe-inline'"],  
            "img-src":["'self'","https://cdn.dummyjson.com"]
        }
    },
    // to provide attecker to write iframe in page
    xFrameOptions:{
        action:"deny"
    }
}))

app.use(compression())
// to present the requests on terminal
// app.use(morgan("dev"))


// to provide DOS attack
const limiter=rateLimit({
    windowMs:15 * 60 * 1000, // 15 minutes
    limit:1000, // you have 100 request from one ip address at 15 minutes
    message:"Too many requests, please try again later"
})

app.use(limiter)






//======= template engine ========
// to intgrate template engine (pug) with express
app.set("view engine","pug");

// to read the files pug from views => to start read from src file
app.set("views",path.join(__dirname,"views"))
app.use('/assets', express.static(path.join(__dirname, 'assets')));
// we put the directory of static files to "pubic file" it is contain the styles
// and solve problem style do not work,
app.use(express.static(path.join(__dirname,"public")));





app.use("/",renderRoutes)
app.use("/api",apiRouter)




app.get("/*",(req,res)=>{
    if(req.originalUrl.startsWith("/api")){
        res.status(404).json({
            status:"fail",
            message:`the ${req.originalUrl} Url Not Found`
        })
    }
    res.status(404).render("error",{status:404,title:"Not Found"})
})

app.use(ErrorMeddileware.handle)


// to solve environment Problem => we use "dotenv libairary"
const PORT=process.env.PORTNUM || 5001;


mongoose.connect(mongoURI).then(()=>{
    console.log("mongoose Server");
}) ; 
app.listen(PORT,()=>{
    console.log(`the server started on localhost:${PORT}`)
})
