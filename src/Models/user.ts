import mongoose from "mongoose";
import { IUser } from "../interfaces/User";

let schema=new mongoose.Schema({
    _id:{
        type:Number,
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    cardID:{
        type:String,
        unique:true,
        description:"card ID is aready registered",
        required:true
    },
    email:{
        type:String,
        unique:true,
        description:"Email is aready registered",
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

let UserModel= mongoose.model<IUser>("user",schema);

export default UserModel;