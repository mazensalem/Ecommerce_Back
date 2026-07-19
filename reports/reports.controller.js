const Order = require('../orders/order.model');
const Products = require('../products/products.model');
const Users = require('../users/user.model');

exports.getStats = async (req, res) => {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const orders = await Order.aggregate([
        { 
            $match: {
                createdAt: {
                    $gte: startOfMonth,
                },
                status: 'Recieved'
            },

        },
        { $unwind: "$products" },
        {
            $group: {
                _id: null,
                totalRevenue: { 
                    $sum: { $multiply: ["$products.pricePerUnit", "$products.quantity"] } 
                },
                ordersCount: {$sum: 1}
            }
        }
    ]);

    const users = await Users.aggregate([
        {
            $group: {
                _id: null,
                usersCount: {$sum: 1}
            }
        }
    ]);

    const products = await Products.aggregate([
        {
            $group: {
                _id: null,
                productsCount: {$sum: 1}
            }
        }
    ]);

    res.status(200).json({msg: 'stats', data: {...orders["0"], ...users["0"], ...products["0"]}}); 
}


exports.latestOrders = async (req, res) => {
    const orders = await Order.find({}).sort({createdAt: -1}).limit(5).populate('userId');
    res.status(200).json({msg: 'orders', data: orders});
}


exports.lowStockProducts = async (req, res)=>{
    products = await Products.find({stock: {$lte: 10}});
    res.status(200).json({msg: 'low stock products', data: products});
}