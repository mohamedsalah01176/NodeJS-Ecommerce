import  jwt  from 'jsonwebtoken';
import path from "path";
import fs from "fs";
import { IBodyProduct, ICart, IProduct } from "../interfaces/Product";
import ProductModel from"../Models/products";
import CartModel from "../Models/cart";
import CouponModel from '../Models/coupon';

// service in MVC => it response to doing logic;

export class ProductsService{
    private  products:IProduct[]=[];
    private  cartProducts:ICart[]=[];
    constructor(){
        this.PromiseData();
    }
    async PromiseData(){
            try{
                let data=await ProductModel.find({});
                this.products=data
            }catch(err){
                console.log(err);
                return []
            }
    }
    findAll(){
        return this.products;
    }

    async returProductById(id:number){
        return await ProductModel.findOne({_id:id});
    }

    filterProducts(querySTR:string):IProduct[] | undefined{
        let valueQuery=querySTR?.split(",");
        let newProduct=[];
        if(valueQuery){
            newProduct= this.products.map((product:IProduct,index:number)=>{
                let filterProducts:any={};
                
                valueQuery.forEach((val:string)=>{
                    filterProducts[val]=product[val as keyof IProduct];
                })
                return {_id:product._id,...filterProducts};
            })
            return newProduct;
        }    
    }
    filterById(filterId:number){
        let product=this.products.find(item=>item._id == filterId) 
        return product
    }
    addProduct(productBody:IBodyProduct){
        let newProduct={_id:this.products.length + 1,...productBody}
        let newArray:IProduct[]=[...this.products,newProduct]
        // this.productsService.findAll().push(newProduct);
        let pathData=path.join(__dirname,"../data/products.json");
        fs.writeFile(pathData,JSON.stringify(newArray),"utf-8",(err)=>{
            console.log(err);
        })
        return newProduct ;
    }
    updataProductByIndex(bodyProduct:IBodyProduct,indexOfProduct:number){
        return  this.products[indexOfProduct]={...this.products[indexOfProduct],...bodyProduct};
    }
    deleteProductById(id:number){
        return this.products.filter(item=>item._id !== id)
    }
    relatedProductsFun(id:number){
        let product=this.filterById(id);
        return this.products.filter(item => item.category === product?.category)
    }
    getCategoryProducts(categoryUrl:string){
        return this.products.filter((item)=>item.category == categoryUrl);
    }



    async handelAddToCart(productId:number,newPrice:number,token:string){
        try{
            if(!token){
                return {
                    status:"fail",
                    message:"Unauthorized: No token provided"
                }
            }
            let decodeToken:any=jwt.verify(token,process.env.SECTERTOKENKEY as string);
            let userId=decodeToken.id
            let currentProduct=await this.returProductById(productId);
            let foundProduct= await CartModel.findOne({_id:productId,userId:userId});
            if(foundProduct){
                await CartModel.updateOne({title:foundProduct.title},{$inc:{quantity:1}})
            }else{
                await CartModel.create({userId,newPrice,...currentProduct?.toObject(),quantity:1})
            }
            return{
                sattus:"success", 
                message:"done"
            }
        }
        catch(err){
            console.log(err)
            return{
                sattus:"fail",
                message:err
            }
        }
    }
    async AllCartProducts(token:string){
        if(!token){
            return {
                status:"fail",
                message:"token undefined"
            };
        }
        try{
            let decodeToken:any=jwt.verify(token,process.env.SECTERTOKENKEY as string);
            let userId=decodeToken.id
            let products=await CartModel.find({userId:userId},{__v:0,_id:0});
            return {
                status:"success",
                products,
            }
        }
        catch(err){
            return {
                status:"fail",
                message:"Invalid or expired token"
            };
        }
    }
    async handleCpoupon(token:string,coupun:string){
        if(!token){
            return {
                status:"fail",
                message:"token undefined"
            };
        }
        try{
            let foundCoupon= await CouponModel.findOne({coupon:coupun});        
            if(foundCoupon){
                return {
                    status:"success",
                    discountValue:foundCoupon.value,
                };
            }else{
                return {
                    status:"fail",
                    message:"coupon NotFound"
                };
            }
        }
        catch(err){
            console.log(err);
            return {
                status:"fail",
                message:"Coupon Not Valid"
            };
            
        }
    }
}   