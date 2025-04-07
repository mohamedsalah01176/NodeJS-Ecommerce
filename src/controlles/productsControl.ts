import { IBodyProduct, IProduct } from '../interfaces/Product';
import { ProductsService } from './../services/productsService';
import {Request,Response} from "express"


// controller in MVC => it response to send and resive requist;
export class ProductsControl{
    constructor(private productsService:ProductsService){
    }
    renderHomePage(req:Request,res:Response){
        res.render("home",{
            title:"Home Page",
            url:"Home",
            products: this.productsService.findAll(),
            baseURL:process.env.BASEURL
        })
    }
    renderAllProducts(req:Request,res:Response){
        res.render("products",{
            title:"Products Page",
            products: this.productsService.findAll(),
            url:`Home/${req.url}`,
            baseURL:process.env.BASEURL

        })
    }
    renderSingleProductpage(req:Request,res:Response){
        let id=req.params.id
        if(!isNaN(+id)){
            res.render("singleProduct",{
                product:this.productsService.filterById(+id),
                relatedProducts:this.productsService.relatedProductsFun(+id),
                url:`Home/${req.url}`,
                title:"Home page",
                baseURL:process.env.BASEURL

            });
        }
        else{
            res.render("categoryProduct",{
                category:id,
                url:`Home/${req.url}`,
                categoryProducts:this.productsService.getCategoryProducts(id),
                title:"Category page",
                baseURL:process.env.BASEURL
            })
        }
    }
    renderCartPage(req:Request,res:Response){
        res.render("cart",{url:`Home/${req.url}`,title:"Cart page",baseURL:process.env.BASEURL});
    }
    renderSearchedProducts(req:Request,res:Response){
        let resSer:any=this.productsService.handleSearchProduct(req.params.searchTitle);
        if(resSer.status === "success"){
            res.render("searchedProducts",{
                searchedProducts:resSer.searchedProducts,
                url:`Home/${req.url}`,
                title:"Searched products",
                baseURL:process.env.BASEURL

            })
        }
        if(resSer.status === "fail"){
            res.status(404).render("error",{
                resSer:resSer,
                title:"Not Found products",
                baseURL:process.env.BASEURL
            })
        }
    }
    renderAboutPage(req:Request,res:Response){
        res.render("about",{
            title:"About page",
            url:`Home/${req.url}`,
            baseURL:process.env.BASEURL
        })
    }

    async addToCart(req:Request,res:Response) { 
        let token:string =req.headers["authorization"]?.split(" ")[1] as string;
        let resSer=await this.productsService.handelAddToCart(req.body.productId,req.body.newPrice,token);
        if(resSer.status === "success"){
            res.status(200).send({resSer})
        }
        
        if(resSer.status === "fail"){
            res.status(400).send({resSer})
        } 
    }
    async getCartProducs(req:Request,res:Response){
        let token:string =req.headers["authorization"]?.split(" ")[1] as string;
        let resSer=await this.productsService.AllCartProducts(token);
        if(resSer.status === "success"){
            res.json(resSer)
        }
        if(resSer.status === "fail"){
            res.status(400).json(resSer);
        }
    }
    async checkCoupon(req:Request,res:Response){
        let token:string =req.headers["authorization"]?.split(" ")[1] as string;
        let coupon=req.body.coupon;
        let resSer=await this.productsService.handleCpoupon(token,coupon);
        if(resSer.status === "success"){
            res.send(resSer)
        }
        if(resSer.status === "fail"){
            res.status(400).send(resSer)
        }
    }
    async deleteCartProduc(req:Request,res:Response){
        let token=req.headers["authorization"]?.split(" ")[1] as string
        let resSer:any=await this.productsService.handleDeleteProduct(token,req.body.productId);
        if(resSer.status === "success"){
            res.send(resSer)
        }
        if(resSer.status === "fail"){
            res.status(400).send(resSer)
        }
        
    }
    async updateCartProduc(req:Request,res:Response){
        let token=req.headers["authorization"]?.split(" ")[1] as string
        let resSer:any=await this.productsService.handleUpdateProduct(token,req.body.productId,req.body.newQuaintity);
        if(resSer.status === "success"){
            res.send(resSer)
        }
        if(resSer.status === "fail"){
            res.status(400).send(resSer)
        }
    }
    searchProducts(req:Request,res:Response){
        let searchTitle=req.body.title;
        let resSer:any= this.productsService.handleSearchProduct(searchTitle);
        if(resSer.status === "success"){
            res.send(resSer)
        }
        if(resSer.status === "fail"){
            res.status(404).send(resSer)
        }
    }
}