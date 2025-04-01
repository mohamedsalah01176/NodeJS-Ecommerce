import { Request, Response } from "express"
import { UserServices } from "../services/userService"
import { IUser } from "../interfaces/User";


export class UserControl{
    countLogin:number=0;
    email:string="";
    constructor(private userService:UserServices){}

    renderRegisterPage(req:Request,res:Response){
        
        res.render("register")
    }
    async postResiter(req:Request,res:Response){
        let body:IUser=req.body;
        let resSer=await this.userService.registeration(body);
        if(resSer?.status === "fail"){
            res.status(403).send(resSer)
        }else{
            res.status(200).send(resSer);;
        }
    }

    renderLogin(req:Request,res:Response){
        res.render("login")
    }
    renderResetPassword(req:Request,res:Response){
        this.email=req.params.email;
        res.render("resetPassword")
    }
    async postLogin(req:Request,res:Response){
        let body=req.body;
        let resSer:any=await this.userService.login(body) 
        if(resSer.status === "success"){
            res.status(200).send(resSer)  
        }else{
            this.countLogin++;
            res.status(400).send(resSer)  
        }
        
    }
    async forgetPassword(req:Request,res:Response){
        let body=req.body;
        let resSer=await this.userService.handleForgetPassword(body.forgetEmail);
        if(resSer?.status === "fail"){
            res.status(403).send(resSer)
        }else{
            res.status(200).send(resSer);;
        }
    }
    
    async resetPassword(req:Request,res:Response){
        let newPassword=req.body.password;
        let resSer:any=await this.userService.handleResetPassword(newPassword,this.email);
        if(resSer.status === "success"){
            res.status(200).send(resSer)  
        }else{  
            this.countLogin++; 
            res.status(400).send(resSer)  
        }
        
    }
    
}

