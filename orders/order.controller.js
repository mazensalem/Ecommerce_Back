const AppError = require('../utils/appError.util');
const Order = require('./order.model');
const Cart = require('../cart/cart.model');
const Address = require('../address/address.model');
const Products = require('../products/products.model');
const mongoose = require('mongoose');

exports.getOrders = async (req, res) => {
    const userId = req.user._id;
    const orders = await Order.find({userId});
    res.status(200).json({msg: 'orders', data: orders});
}

exports.getAllOrders = async (req, res) => {
    const orders = await Order.find();
    res.status(200).json({msg: 'all orders', data: orders});
}


exports.createOrder = async (req, res, next) => {
    const userId = req.user._id;
    const {addressId} = req.body;
    let userAddress;
    if (addressId){
        userAddress = await Address.findById(addressId);
        if (userAddress.user != userId) { return next(new AppError("this address isn't valid", 400)); }
    }else{
        userAddress = await Address.findOne({isDefault: true, user: userId});
    }

    if (!userAddress){
        return next(new AppError("you don't have any adresses", 400));
    }
    
    const cart = await Cart.findOne({userId}).populate('products.productId');
    if (!cart.products.length){
        return next(new AppError('no product found', 404));
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        for (product of cart.products){
            if (
                product.productId.price == product.pricePerUnit &&
                product.productId.isActive && !product.productId.isDeleted &&
                product.productId.stock >= product.quantity
            ){
                await Products.updateOne({_id: product.productId._id},
                    {$inc: {stock: -product.quantity}}, 
                    {session}
                );
                
            }else{
                session.abortTransaction();
                return next(new AppError("this order can't be fullfilled", 400));
            }
        }
        
        
        const order = await Order.create(
            [{
                userId, 
                status: 'Pendding',
                products: cart.products, 
                address: {address: userAddress.address, phone: userAddress.phone}
            }],
            {session});
            
        await Cart.updateOne({userId}, {products: []}, {session})
        await session.commitTransaction();
        res.status(201).json({"msg": "order sent", data: order});
    }catch (err){
        console.log(err);
        await session.abortTransaction();
        return next(new AppError('something is wrong'), 500);
    }
}

exports.getOrder = async (req, res, next) => {
    const orderId = req.params.id;
    const userId = req.user._id;
    const order = await Order.findOne({userId, _id: orderId});
    if (!order){
        return next(new AppError("this order is not found", 404));
    }
    res.status(200).json({msg: 'single order', data: order});
}

exports.setOrderStatus = async (req, res, next) => {
    const orderId = req.params.id;
    if (!orderId){
        return next(new AppError('no order provided', 404));
    }
    const {status} = req.body;
    const order = await Order.findByIdAndUpdate(orderId, {status}, {new: true});
    res.status(200).json({msg: 'order updatad', data: order});
}

exports.cancelOrder = async (req, res, next) =>{
    const userId = req.user._id;
    const orderId = req.params.id;
    const orderOld = await Order.findOne({userId, _id: orderId});
    if (orderOld && orderOld.status == 'Pendding'){
        const order = await Order.findOneAndUpdate({userId, _id: orderId}, {status: 'Canceled by user'}, {new: true});
        res.status(200).json({msg: "canceled", data: order});
    } else {
        next(new AppError("you can't cancel this order", 400));
    }
}

