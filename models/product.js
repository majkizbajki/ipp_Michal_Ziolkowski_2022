class product{
    constructor (productId,name, price = null, amount, category, buyer = null){
        this.productId = productId;
        this.name = name;
        this.price = price;
        this.amount = amount;
        this.category = category;
        this.buyer = buyer;
    }
}

export default product;