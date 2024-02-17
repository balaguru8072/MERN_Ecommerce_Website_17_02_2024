const catchAsyncError = require('../middlewares/catchAsyncError');
const Order = require('../models/orderModel');
const ErrorHandler = require('../utils/errorHandler');
const User = require('../models/userModel');
const Product = require('../models/productModel')

//Create new Order http://localhost:8000/api/v1/order/new ("first please login after u order send")

exports.newOrder = catchAsyncError(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user.id
    })

    res.status(200).json({
        success: true,
        order
    })
})


//Get Single Order - http://localhost:8000/api/v1/order/:id(65d09e95d3ca0c373f6623d3), product order id
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        order
    })
})

//Get loggedIn User Order http://localhost:8000/api/v1/myorders
exports.myOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id });
    // if (!orders) {
    //     return next(new ErrorHandler(`Order not found with this id: ${user: req.user.id}`, 404))
    // }

    res.status(200).json({
        success: true,
        orders
    })
})

//Admin: Get all Order http://localhost:8000/api/v1/orders
exports.orders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

//Admin: update Order/ order Status http://localhost:8000/api/v1/order/:id (65d09e95d3ca0c373f6623d3) 
//         {
//              "orderStatus" : "Delivered"
//          }

exports.updateOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (order.orderStatus == 'Delivered') {
        return next(new ErrorHandler('Order has been already delivered!', 400))
    }

    //updating the product stock of each order item 
    order.orderItems.forEach(async orderItems => {
        await updateStock(orderItems.product, orderItems.quantity)
    })

    order.orderStatus = req.body.orderStatus;
    order.deliveredAt = Date.now();
    await order.save();

    res.status(200).json({
        success: true,

    })

});

async function updateStock(productId, quantity) {
    const product = await Product.findById(productId);
    product.stock = product.stock - quantity;

    product.save({ validateBeforeSave: false })
}

//Admin: Delete Order 
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findByIdAndDelete(req.params.id);
    console.log(order, "delete order");
    if (!order) {
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404))
    }
    
    // await order.remove(); // Assuming `order` is correctly retrieved from the database
    
    res.status(200).json({
        success: true
    });
});
