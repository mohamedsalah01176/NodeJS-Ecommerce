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

    filterById(filterId:number){
        let product=this.products.find(item=>item._id == filterId) 
        return product
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
                let newProduct=new CartModel({userId,newPrice,...currentProduct?.toObject(),quantity:1});
                await newProduct.save()
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
            let products=await CartModel.find({userId:userId},{__v:0});
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
    async handleDeleteProduct(token:string,productId:number){
        if(!token){
            return{
                status:"fail",
                message:"token Not Found"
            }
        }
        try{
            let decodeToken:any= jwt.verify(token,process.env.SECTERTOKENKEY as string);
            let userId=decodeToken.id
            console.log(userId)
            let deleteProduct=await CartModel.deleteOne({_id:productId,userId:userId});
            console.log(deleteProduct)
            if(deleteProduct.deletedCount>0){
                return{
                    status:"success",
                    message:"products Deleted"
                }
            }
            if(!deleteProduct){
                return{
                    status:"fail",
                    message:"products Not Found"
                }
            }
        }
        catch(err){
            return{
                status:"fail",
                message:err
            }
        }
    }
    async handleUpdateProduct(token:string,productId:number,newQuaintity:number){
        if(!token){
            return{
                status:"fail",
                message:"token Not Found"
            }
        }
        if(newQuaintity<=5){
            try{
                let decodeToken:any= jwt.verify(token,process.env.SECTERTOKENKEY as string);
                let userId=decodeToken.id
                let updatedProduct=await CartModel.updateOne({_id:productId,userId:userId},{$set:{quantity:newQuaintity}});
                console.log(updatedProduct)
                if(updatedProduct.modifiedCount>0){ 
                    return{
                        status:"success",
                        message:"products updated"
                    }
                }
                if(!updatedProduct){
                    return{
                        status:"fail",
                        message:"products Not Found"
                    }
                }
            }
            catch(err){
                return{
                    status:"fail",
                    message:err
                }
            }
        }else{
            return{
                status:"fail",
                message:"the store contain only 5 items"
            }
        }
    }
    
    handleSearchProduct(title:string){
        try{
            let searchedProducts=this.products.filter((item)=>item.title.toLowerCase().includes(title.toLowerCase()))
            if(searchedProducts.length>0 ){
                return{
                    status:"success",
                    searchedProducts:searchedProducts,
                }
            }
            else{
                return{
                    status:"fail",
                    searchedProducts:`The ${title} Not Found`,
                }
            }
        }
        catch(err){
            return{
                status:"fail",
                searchedProducts:err,
            }
        }
    }
}   