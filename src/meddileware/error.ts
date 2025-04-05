import { NextFunction, Request, Response } from "express";

export default class ErrorMeddileware{
    static handle(err:Error,req:Request,res:Response,next:NextFunction){
        if(req.originalUrl.startsWith("/api")){
            res.status(500).json({
                status:"fail",
                message:err.message
            })
            return;
        }

        res.status(500).render("error",{
            title:"Server Error",
            status:500
        })

        // next();
    }
}