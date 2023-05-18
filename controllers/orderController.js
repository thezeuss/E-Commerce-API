const Order = require("../models/order");
const Product = require("../models/product");
const BigPromise = require("../middlewares/bigPromises");
const CustomError = require("../utils/customError");
const usermiddleware = require("../middlewares/usermiddleware");


exports.createOrder = BigPromise(async (req, res, next) => {
    const { shippingInfo, 
    orderItems,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,
    } = req.body;


    const order = await Order.create({ shippingInfo, 
        orderItems,
        paymentInfo,
        taxAmount,
        shippingAmount,
        totalAmount,
        user: req.user._id
        });

        res.status(200).json({
            success: true,
            order, 
        })

});

exports.getOneOrder = BigPromise( async (req, res, next) => {

    const order = await Order.findById(req.params.id).populate('user','name email phoneno');

    if(!order){
        return next(new CustomError("please check order id", 401));
    }

    res.status(200).json({
        success: true,
        order
    })


});

exports.getMyOrder =  BigPromise(async (req, res, next) => {
    const order = await Order.find({user: req.user._id});

    if(!order){
        return next(new CustomError("No orders found!"), 401)
    };

    res.status(200).json({
        success: true,
        order
    });
});

//admin route
exports.getOrders =  BigPromise(async (req, res, next) => {
    const order = await Order.find();

    if(!order){
        return next(new CustomError("No orders found!"), 401)
    };

    res.status(200).json({
        success: true,
        order
    });
});

exports.adminUpdateOrder =  BigPromise(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(order.orderStatus === "Delivered"){
        return next(new CustomError("Order is already marked for Delivered."), 401);

    };

    order.orderStatus = req.body.orderStatus;

    passwordReset.orderItems.forEach(async prod => {
        await updateProductStock(prod.product, prod.quantity)
    });

    await order.save();

    res.status(200).json({
        success: true,
        order
    });
});

exports.admindeleteOrder = BigPromise(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    await order.remove();
   

    res.status(200).json({
        success: true,
        message: "Order Deleted!"
});
});

async function updateProductStock(productId, quantity){
    const product = await Product.findById(productId);

    
    product.stock = product.stock - quantity;

   await product.save({validateBeforeSave: false});
};


