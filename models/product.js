class product{
    constructor (productId,name, price = null, amount, category){
        this.productId = productId;
        this.name = name;
        this.price = price;
        this.amount = amount;
        this.category = category;
    }
}

export default product;