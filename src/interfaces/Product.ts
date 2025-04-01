interface IProduct{
        _id: number,
        title: string,
        price: number,
        description: string,
        category: string,
        rating:number,
        thumbnail:string,
        images:string[],
        minimumOrderQuantity:number,
        reviews:{}[],
        availabilityStatus: string,
        discountPercentage:number
        
}

    
    
interface IBodyProduct{
    title: string,
    price: number,
    description: string,
    category: string,
    rating:number,
    thumbnail:string,
    images:string[],
    minimumOrderQuantity:number,
    reviews:{}[],
    availabilityStatus: string,
    discountPercentage:number
    
}

interface ICart extends IProduct{
    quantity:number
}



export {
    IProduct,
    IBodyProduct,
    ICart
}