const Cart = require('./cart.model');

exports.createCart = async (userId) => { await Cart.create( { userId, products: [] } ); };

const ValidateCart = async (cartId) => {
    let cart = await Cart.findById(cartId).populate('products.productId');
    cart.products.forEach((el, i)=>{
        cart.products[i].pricePerUnit = el.productId.price;
    })

    return await Cart.findByIdAndUpdate(cartId, cart, {returnDocument: 'after'});
}

exports.addProduct = async (req, res) => {
    // https://www.mongodb.com/docs/manual/reference/operator/update/positional-filtered/
    const id = req.user._id;
    const {product} = req.body;

    let cart = await Cart.findOneAndUpdate(
        {userId: id, "products.productId": product}, 
        {$inc: {'products.$.quantity': 1}},
        { returnDocument: 'after' }
    )
    if (!cart){
        cart = await Cart.findOneAndUpdate(
            {userId: id}, 
            {
                $push: {products: {productId: product, quantity: 1, pricePerUnit: 0}}
            },
            { returnDocument: 'after' }
        )
    }
    cart = await ValidateCart(cart._id);
    res.status(201).json({msg: "updated", data: cart});
}

exports.getCart = async (req, res) => {
    const userId = req.user._id;
    const cart = await Cart.findOne({userId}).populate('products.productId', ['title', 'price', 'stock', 'isActive']);
    res.status(200).json({msg: "cart", data: cart});
}

exports.validate = async (req, res) => {
    const userId = req.user._id;
    console.log(userId);
    let cart = await Cart.findOne({userId});
    cart = await ValidateCart(cart._id);
    res.status(200).json({msg: 'validated', data: cart});
}

exports.decreaseProduct = async (req, res, next) => {
    const { product } = req.body;
    const userId = req.user._id;

    let cart = await Cart.findOneAndUpdate(
        {userId, "products.productId": product}, 
        {$inc: {'products.$.quantity': -1}},
        { returnDocument: 'after' }
    );
    if (cart){
        res.status(200).json({msg: 'udated', data: cart});
    } else {
        next(new AppError("this product is not in the cart", 404));
    }
}

exports.removeProduct = async (req, res) => {
    const {product} = req.body;
    const userId = req.user._id;
    const cart = await Cart.findOneAndUpdate({userId}, {
        $pull: {products: {productId: product}}
    }, {returnDocument: 'after'});

    res.status(200).json({msg: 'removed', data: cart});
}

exports.clearCart = async (req, res) => {
    const {product} = req.body;
    const userId = req.user._id;
    const cart = await Cart.findOneAndUpdate({userId}, {
        products: []
    }, {returnDocument: 'after'});

    res.status(200).json({msg: 'removed', data: cart});
}
