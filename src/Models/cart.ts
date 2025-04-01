import mongoose from "mongoose";
import { ICart } from "../interfaces/Product";

let Schema=new mongoose.Schema({
                _id:{
                    type:Number,
                    required:true
                },
                userId:{
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
                quantity:{
                    type:Number
                },
                newPrice:{
                    type:Number,
                    required:false
                }
            })

let CartModel= mongoose.model<ICart>("cart",Schema);

export default CartModel;