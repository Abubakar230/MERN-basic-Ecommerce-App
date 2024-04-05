import { Product } from "../models/product.model.js"
import {ApiResponse} from '../utils/ApiResponse.js'
import {ApiError} from '../utils/ApiError.js'
import asyncHandler from '../utils/asyncHandler.js'
import {Order} from '../models/order.model.js'



const newOrder = asyncHandler( async(req,res)=>{

    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      } = req.body;
    
      const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
      });
    
      res.status(201).json(new ApiResponse(200, order));

})


// Get single Order
const getSingleOrder = asyncHandler( async(req,res)=>{

    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"                   // Give User name and Email
      );
    
      if (!order) {
        throw new ApiError(404, "Order not found with this Id");
      }
    
      res.status(201).json(new ApiResponse(200, order));


})


// Get Logged In User Order
const myOrders = asyncHandler( async(req,res)=>{

    const orders = await Order.find({ user: req.user._id });


      res.status(201).json(new ApiResponse(200, orders));

})


// Get All Order  -- Admin
const getAllOrders = asyncHandler( async(req,res)=>{

    const orders = await Order.find();


  let totalAmount = 0;              // All users total amount who order (100*10)=1000

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

      res.status(201).json(new ApiResponse(200, orders, totalAmount));

})


// Update Order Status -- Admin
const updateOrder = asyncHandler( async(req,res)=>{

     const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, "Order not found with this Id");
  }

  if (order.orderStatus === "Delivered") {
    throw new ApiError(404,"You have already delivered this order");
  }


  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }


  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });


    res.status(201).json(new ApiResponse(200, order));

})

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
  
    product.stock -= quantity;
  
    await product.save({ validateBeforeSave: false });
}


// delete Order -- Admin
const deleteOrder = asyncHandler( async(req,res)=>{

    const order = await Order.findById(req.params.id)
    
      if (!order) {
        throw new ApiError(404, "Order not found with this Id");
      }

      await Order.deleteOne({ _id: order._id });
    
      res.status(201).json(new ApiResponse(200, order));

})





export {newOrder,getSingleOrder,myOrders,getAllOrders,updateOrder,deleteOrder}