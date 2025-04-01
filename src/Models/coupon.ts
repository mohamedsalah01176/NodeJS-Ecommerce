import mongoose from "mongoose";
import ICoupon from "../interfaces/coupon"

let schema=new mongoose.Schema({
    coupon:{
        type:String,
    },
    value:{
        type:Number,
    }
})

let CouponModel= mongoose.model<ICoupon>("coupons",schema);

export default CouponModel;