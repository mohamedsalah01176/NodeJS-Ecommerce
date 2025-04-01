import {faker} from "@faker-js/faker"
import { IProduct } from "../interfaces/Product"
import fs,{promises as FSPromises} from "fs"
import path from "path";



export  function getFakeData():IProduct[]{
        let pathData=path.join(__dirname,"products.json");
        // let products:IProduct[]=[]
        let data=fs.readFileSync(pathData,"utf-8");
        let products=JSON.parse(data);
        return products;
} 




// export function getFakeData():IProduct[]{
//     return Array.from({length:20},(item:IProduct,index:number)=>{
//         return {
//             id:index+1,
//             title:faker.commerce.productName(),
//             price:+faker.commerce.price(),
//             discription:faker.commerce.productDescription()
//         }
//     })
// } 