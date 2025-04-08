import { IUser } from "../interfaces/User";
import UserModel from "../Models/user";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

dotenv.config();

export class UserServices{
    users:IUser[]=[];
    constructor(){
        this.getAllUsers()
    }

    async getAllUsers(){
        try{
            let data=await UserModel.find({});
            this.users= data ;
        }catch(err){
            return [];
        }
    }
    AllUsers(){
        return this.users; 
    }
    async registeration(body:IUser){
        let users=await UserModel.find({})
        let bcryptPass=await bcrypt.hash(body.password,10);
        let cardIDPass=await bcrypt.hash(body.cardID,10)
        try{
            const lastUser: any = users.length > 0 ? users[users.length - 1] : { _id: 0 };
            const newId = lastUser._id + 1;
            let newUser= new UserModel({_id:newId,...body,password:bcryptPass,cardID:cardIDPass});
            await newUser.save();
            return{
                status:"success", 
                message:`the user regetered`,
            }
        }catch(error:any){
            if (error.code === 11000) {
                console.log(Object.keys(error.keyPattern))
                    return {
                        status:"fail",
                        message:`the email or card id is aready regestered`,
                    }
            }
            if(error.name == "ValidationError"){ 
                return {
                    status: "fail",
                    message: "Validation failed",
                    errors: error.errors
                }
            }
        }
    }


    async login(body:IUser){
        let emailFound=await UserModel.findOne({email:{$eq:body.email}}) ;
        if(emailFound ){
            let checkPassword=await bcrypt.compare(body.password,emailFound.password);
            if(!checkPassword){
                return{
                    status:"fail",
                    message: "The Password is not correct",
                }
            }else{
                let token= jwt.sign({ id: emailFound._id, email: emailFound.email },process.env.SECTERTOKENKEY as string,{expiresIn:"30d"});
                return{
                    status:"success",
                    message:"Welcome in our wedSite",
                    token:token
                }
            }
        }else{
            if(!emailFound){
                return{
                    status:"fail",
                    message: "The Email not registered",
                }
            }
            
        }
    }

    async handleForgetPassword(cardID:string){
        
        let foundUser:any=this.users.find(async(user)=> await bcrypt.compare(cardID,user.cardID));
        // let foundUser= await UserModel.findOne({email:{$eq:forgetEmail}});
        console.log(foundUser.email) 
        if(foundUser){
            let transporter =nodemailer.createTransport({
                service:"gmail",
                auth: {
                    user: process.env.AUTHEMAIL,
                    pass: process.env.AUTHPASS,
                },
                secure: true,
                port: 465,
            })
            let resetLink=`http://localhost:5000/resetPassword/${foundUser.email}`
            let emailContent = {
                from: `"Support Team" <${process.env.AUTHEMAIL}>`,
                to: foundUser.email,
                subject: "Reset Your Password",
                text: `Hello, click the link below to reset your password`,
                html: `<html>
                            <head>
                                <style>
                                    body {
                                        font-family: Arial, sans-serif;
                                        background-color: #f4f4f4;
                                        margin: 0;
                                        padding: 0;
                                    }
                                    .email-container {
                                        max-width: 600px;
                                        margin: 20px auto;
                                        background: #ffffff;
                                        padding: 20px;
                                        border-radius: 10px;
                                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                                        text-align: center;
                                    }
                                    h2 {
                                        color: #333;
                                    }
                                    p {
                                        font-size: 16px;
                                        color: #555;
                                    }
                                    .reset-button {
                                        display: inline-block;
                                        margin-top: 15px;
                                        padding: 12px 25px;
                                        font-size: 18px;
                                        color: #ffffff;
                                        background: #007bff;
                                        text-decoration: none;
                                        border-radius: 5px;
                                        font-weight: bold;
                                    }
                                    .reset-button:hover {
                                        background: #0056b3;
                                    }
                                    .footer {
                                        margin-top: 20px;
                                        font-size: 14px;
                                        color: #888;
                                    }
                                </style>
                            </head>
                            <body>
                                <div class="email-container">
                                    <h2>Reset Your Password</h2>
                                    <p>Hello,</p>
                                    <p>Click the button below to reset your password:</p>
                                    <a href=${resetLink} class="reset-button">Reset Password</a>
                                    <p>If you didn't request this, please ignore this email.</p>
                                    <p class="footer">This is an automated message, please do not reply.</p>
                                </div>
                            </body>
                            </html>
                            `,
            };
            try{
                await transporter.sendMail(emailContent);
                return{
                    status:"success",
                    message:"Check your gmail account"
                }
            }
            catch(err){
                return{
                    status:"fail",
                    message:"Error sending error. Please try again"
                }
            }
        }else{
            return{
                status:"fail",
                message: "The Email not registered",
            }
        }
    }


    async handleResetPassword(newPassword:string,email:any){
        let currentUser=this.users.find(async(user)=>user.email === email);
        let bcryptUser=await bcrypt.hash(newPassword,10)
        console.log(currentUser) 

        if(currentUser){
            let upDataUser=await UserModel.updateOne({email:{$eq:currentUser.email}},{$set:{password:bcryptUser}});
            if(upDataUser){
                return{
                    status:"succes",
                    message:"The Password Updated"
                }
            }else{
                return{
                    status:"fail",
                    message:"The Not registered"
                }
            }
        }
    }
} 