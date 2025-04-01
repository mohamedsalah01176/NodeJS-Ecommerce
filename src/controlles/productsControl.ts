import { IBodyProduct, IProduct } from '../interfaces/Product';
import { ProductsService } from './../services/productsService';
import {Request,Response} from "express"


// controller in MVC => it response to send and resive requist;
export class ProductsControl{
    constructor(private productsService:ProductsService){
    }
    getAllProducts(req:Request,res:Response):void{
        // res.status(200).json( this.productsService.findAll())
        let querySTR=req.query.filter as string; 
        if(querySTR){
            res.status(200).json(this.productsService.filterProducts(querySTR));
        }else{
            res.status(200).json(this.productsService.findAll());
        }
    }
    getProductById(req:Request,res:Response){
        let id= +req.params.id;
        if(isNaN(id)){
            res.status(400).send({status:"Fail",message:"the ID Product Not valid"});
        } 
        let foundProduct=this.productsService.filterById(id);
        if(foundProduct){
            res.status(200).send({status:"Success",data:foundProduct});
        }else{
            res.status(404).send({status:"Fail",message:"the ID Product Not Found"});
        }
    }
    createProduct(req:Request,res:Response){
        let productBody=req.body;
        if(!productBody){
            res.status(400).send({status:"Fail",message:"the title and price require"});
        }else{
            let newProducts=this.productsService.addProduct(productBody)
            res.status(201).send({status:"Success",data:newProducts});
        }
    }
    updataProduct(req:Request,res:Response){
        let id:number= +req.params.id;
        if(isNaN(id)){
            res.status(400).send({status:"fail",message:"the product id is not valid"});
        }
        let bodyProduct=req.body;
        let indexOfProduct:number=this.productsService.findAll().findIndex((item)=>item._id == id);
        if(indexOfProduct !== -1){
            // we write "id-1" to access the current index of product
            this.productsService.updataProductByIndex(bodyProduct,indexOfProduct)
            res.status(200).send({status:"Success",message:"the product updated"});
        }else{
            res.status(404).send({status:"fail",message:"the product id not Found"});
        }
    }
    deletProduct(req:Request,res:Response){
        let id:number= +req.params.id;
        if(isNaN(id)){
            res.status(400).send({status:"fail",message:"the product id is not valid"});
        }
        let foundProduct:IProduct | undefined=this.productsService.findAll().find((item)=>item._id == id);
        if(foundProduct){
            let filteredProducts:IProduct[]=this.productsService.deleteProductById(id);
            res.status(200).send({status:"Success",data:filteredProducts});
        }else{
            res.status(404).send({status:"fail",message:"the product id is not Found"});
        }
    }
    renderHomePage(req:Request,res:Response){
        res.render("home",{title:"Home Page"})
    }
    renderAllProducts(req:Request,res:Response){

        res.render("products",{
            title:"All Products",
            products: this.productsService.findAll(),
            url:req.url
        })
    }
    renderSingleProductpage(req:Request,res:Response){
        let id=req.params.id
        if(!isNaN(+id)){
            res.render("singleProduct",{
                product:this.productsService.filterById(+id),
                relatedProducts:this.productsService.relatedProductsFun(+id),
                url:req.url
            });
        }
        else{
            res.render("categoryProduct",{
                category:id,
                url:req.url,
                categoryProducts:this.productsService.getCategoryProducts(id)
            })
        }
    }

    async addToCart(req:Request,res:Response) { 
        let token:string =req.headers["authorization"]?.split(" ")[1] as string;
        let resSer=await this.productsService.handelAddToCart(req.body.productId,req.body.newPrice,token);
        console.log(resSer)
        if(resSer.status === "success"){
            res.status(200).send(resSer)
        }
        
        if(resSer.status === "fail"){
            res.status(400).send(resSer)
        } 
    }
    renderCartPage(req:Request,res:Response){
        res.render("cart",{url:`Home/${req.url}`});
    }
    async getCartProducs(req:Request,res:Response){
        let token:string =req.headers["authorization"]?.split(" ")[1] as string;
        let resSer=await this.productsService.AllCartProducts(token);
        if(resSer.status === "success"){
            res.send(resSer)
        }
        if(resSer.status === "fail"){
            res.status(400).send(resSer);
        }
    }
    async checkCoupon(req:Request,res:Response){
        let token:string =req.headers["authorization"]?.split(" ")[1] as string;
        let coupon=req.body.coupon;
        // let coupon="999";
        console.log(coupon)
        let resSer=await this.productsService.handleCpoupon(token,coupon);
        if(resSer.status === "success"){
            res.send(resSer)
        }
        if(resSer.status === "fail"){
            res.status(400).send(resSer)
        }
    }
    
}