import { Router } from "express";
import { ProductsService } from "../services/productsService";
import { UserControl } from "../controlles/userControl";
import { ProductsControl } from "../controlles/productsControl";
import { UserServices } from "../services/userService";

let router=Router();


let productsService=new ProductsService()
let productsControl=new ProductsControl(productsService)

let userservices=new UserServices();
let userControl=new UserControl(userservices)




router.get("/home",(req,res)=>{productsControl.renderHomePage(req,res)})
router.get("/products",(req,res)=>{productsControl.renderAllProducts(req,res)})
router.get("/products/:id",(req,res)=>{productsControl.renderSingleProductpage(req,res)})
router.get("/products/:category",(req,res)=>{productsControl.renderSingleProductpage(req,res)})
router.get("/cart",(req, res)=>productsControl.renderCartPage(req,res))
router.get("/search/:searchTitle",(req, res)=>productsControl.renderSearchedProducts(req,res))
router.get("/about",(req, res)=>productsControl.renderAboutPage(req,res))




router.get("/register",(req,res)=>userControl.renderRegisterPage(req,res))
router.get("/login",(req,res)=>userControl.renderLogin(req,res))
router.get("/resetPassword/:email",(req,res)=>userControl.renderResetPassword(req,res))

export {router}