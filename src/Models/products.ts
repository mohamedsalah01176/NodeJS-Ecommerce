import mongoose  from 'mongoose';
import { IProduct } from '../interfaces/Product';


let productsSechema=new mongoose.Schema({
        _id:{
            type:Number,
            required:true
        },
        title: {
            type:String,
            required:true
        },
        price: {
            type:Number,
            required:true
        },
        description: {
            type:String,
            required:false
        },
        category:{
            type:String,
            required:false
        } ,
        image: {
            type:String,
            required:false
        },
        rating:{
            type:Number,
            required:false
        },
        thumbnail:{
            type:String,
            required:false
        },
        images:{
            type:[String],
            required:false
        },
        minimumOrderQuantity:{
            type:Number,
            required:false
        },
        reviews:{
            type:[Object],
            required:false
        },
        availabilityStatus: {
            type:String,
            required:false
        },
        discountPercentage:{
            type:Number,
            require:false
        },
    })
    
    
let ProductModel=mongoose.model<IProduct>("Product",productsSechema);
    

export default ProductModel;