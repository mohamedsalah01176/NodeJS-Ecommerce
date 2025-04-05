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



router.route("/cart").get((req, res)=>productsControl.getCartProducs(req,res))
    .post((req, res)=>productsControl.addToCart(req,res))
    .delete((req,res)=>productsControl.deleteCartProduc(req,res))
    .patch((req,res)=>productsControl.updateCartProduc(req,res))

router.post("/checkCoupon",(req, res)=>productsControl.checkCoupon(req,res))

router.post("/search",(req, res)=>productsControl.searchProducts(req,res))



router.post("/register",(req,res)=>userControl.postResiter(req,res))
router.post("/login",(req,res)=>userControl.postLogin(req,res))
router.post("/forgetPasswor",(req,res)=>userControl.forgetPassword(req,res))
router.post("/resetPassword",(req,res)=>userControl.resetPassword(req,res))


export {router}