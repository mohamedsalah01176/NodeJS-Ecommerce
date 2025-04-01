import { ProductsControl } from './controlles/productsControl';
import express, { Response,Request } from "express";
import dotenv from "dotenv";
import { getFakeData } from "./data/fakeData";
import { IProduct } from "./interfaces/Product";
import { ProductsService } from "./services/productsService";
import path from 'path';

// import {productsRoute,singleProduct,createProduct,updateProduct,deleteProduct} from "./controlles/RoutesControlles"

dotenv.config();
const app=express();
import mongoose  from 'mongoose';
import { UserControl } from './controlles/userControl';
import { UserServices } from './services/userService';
const mongoURI = process.env.URL_DB as string;
import cors from "cors";



// we use this meddileware for solve post Requist to match data of resquit for same header "application/json"
// the default value application/json
// it execute for all app  
app.use(express.json());

app.use(cors());

/* ====== select custom header ======
    app.use(express.json({
    type:"custom/header"
    }));*/



// to solve environment Problem => we use "dotenv libairary"
const PORT=process.env.PORTNUM || 5001;



// MVC Architictue
let productsService=new ProductsService()
let productsControl=new ProductsControl(productsService)

let userservices=new UserServices();
let userControl=new UserControl(userservices)




//======= template engine ========
// to intgrate template engine (pug) with express
app.set("view engine","pug");

// to read the files pug from views => to start read from src file
app.set("views",path.join(__dirname,"views"))

// we put the directory of static files to "pubic file" it is contain the styles
// and solve problem style do not work,
app.use(express.static(path.join(__dirname,"public")));



app.get("/Home",(req,res)=>{productsControl.renderHomePage(req,res)})
app.get("/products",(req,res)=>{productsControl.renderAllProducts(req,res)})
app.get("/products/:id",(req,res)=>{productsControl.renderSingleProductpage(req,res)})
app.get("/products/:category",(req,res)=>{productsControl.renderSingleProductpage(req,res)})

app.get("/cart",(req, res)=>productsControl.renderCartPage(req,res))
app.get("/api/cart",(req, res)=>productsControl.getCartProducs(req,res))
app.post("/api/cart",(req, res)=>productsControl.addToCart(req,res))
app.post("/api/checkCoupon",(req, res)=>productsControl.checkCoupon(req,res))


app.get("/register",(req,res)=>userControl.renderRegisterPage(req,res))
app.get("/login",(req,res)=>userControl.renderLogin(req,res))
app.get("/resetPassword/:email",(req,res)=>userControl.renderResetPassword(req,res))

app.post("/api/register",(req,res)=>userControl.postResiter(req,res))
app.post("/api/login",(req,res)=>userControl.postLogin(req,res))
app.post("/api/forgetPasswor",(req,res)=>userControl.forgetPassword(req,res))
app.post("/api/resetPassword",(req,res)=>userControl.resetPassword(req,res))



// MVC Architictue
app.get("/api/products",(req,res)=>productsControl.getAllProducts(req,res));
app.get("/api/products/:id",(req,res)=>productsControl.getProductById(req,res))

app.post("/api/products",(req,res)=>productsControl.createProduct(req,res))
app.patch("/api/products/:id",(req,res)=>productsControl.updataProduct(req,res))
app.delete("/api/products/:id",(req,res)=>productsControl.deletProduct(req,res))



app.get("*",(req,res)=>{
    res.render("notFound",{title:"Not Found"})
})



mongoose.connect(mongoURI).then(()=>{
    console.log("mongoose Server");
}) ;

app.listen(PORT,()=>{
    console.log(`the server started on localhost:${PORT}`)
})
