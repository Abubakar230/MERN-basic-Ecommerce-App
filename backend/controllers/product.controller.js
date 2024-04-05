import { Product } from "../models/product.model.js"
import {ApiResponse} from '../utils/ApiResponse.js'
import {ApiError} from '../utils/ApiError.js'
import asyncHandler from '../utils/asyncHandler.js'
import { ApiFeatures } from "../utils/ApiFeatures.js"



// Create Product --Admin
const createProduct = asyncHandler( async(req,res)=>{

    req.body.user = req.user.id      // get the admin id === who admin added new products

    const product = await Product.create(req.body)
    return res
    .status(200)
    .json( new ApiResponse(200, product , "Product is created"))

})


//    Get All Products
const getAllProducts = asyncHandler( async(req,res)=>{
        
    const resultPerPage = 8; // how many pages you show the product 100/5=20

    const productsCount = await Product.countDocuments();

        // search and find            // can also find product by name                 
    const apiFeature = new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage)

    const products = await apiFeature.query;        // used to find you search
    return res
    .status(200)
    .json( new ApiResponse(200, {products, productsCount ,resultPerPage}))
    // .json( new ApiResponse(200, products, productCount ))

})


// Get Single Product Details
const getProductDetails = asyncHandler( async(req,res)=>{

    let product = await Product.findById(req.params.id)      // find product

    if (!product) {                                       //when product not find
        throw new ApiError(500, "Products not Found")
    } 

    return res
    .status(200)
    // .json( new ApiResponse(200, product ))
    .json( new ApiResponse(200, product))

})


// Update Product --Admin
const updateProduct = asyncHandler( async(req,res)=>{

    let product = await Product.findById(req.params.id)      // find product

if (!product) {                                       //when product not find
    throw new ApiError(500, "Products not Found")
}                                                            // when product is find

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new : true,                                                       
        runValidators : true,                                     
        useFindAndModify : false
    })

    return res
    .status(200)
    .json( new ApiResponse(200, product , "Product is updated Successfully"))

})


// Delete Product
const deleteProduct = asyncHandler( async(req,res)=>{

    let product = await Product.findById(req.params.id)

    if (!product) {
        throw new ApiError(500, "Product not found")
    }

    await Product.deleteOne({ _id: product._id });

    return res
    .status(200)
    .json( new ApiResponse(200, "Product is deleted Successfully"))

})


// Create New Review and Update the Review
const createProductReview = asyncHandler( async(req,res)=>{

    const { rating, comment, productId } = req.body;

    const review = {
      user: req.user._id,          // (who review) => this is detail of user
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);          // find product ?? in which product user review

  const isReviewed = product.reviews.find(                     // check== if user is review already
    (rev) => rev.user.toString() === req.user._id.toString() 
  );

  if (isReviewed) { 
    product.reviews.forEach((rev) => {              // reviews is get from product model[]         
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);           // comment and rating update only
    });
  } else {                                // otherwise add some user detail (review/comment)
    product.reviews.push(review);                 
    product.numOfReviews = product.reviews.length;    // count total number of reviews on each product
  }


  let avg = 0;                  // (average rating)    add total ratings on each product

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  
  product.ratings = avg / product.reviews.length;  // Find average reviews

  await product.save({ validateBeforeSave: false });    //  save all reviews/comment/user

  return res
    .status(200)
    .json( new ApiResponse(200))

})


// Get all reviews of the Product
const getProductReviews = asyncHandler( async(req,res)=>{
 
  const product = await Product.findById(req.query.id);      // req.query contains the URL query parameters (after the ? in the URL).

  if (!product) {
    throw new ApiError("Product not found", 404);
  }
  
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });

})


//
const deleteReview = asyncHandler( async(req,res)=>{
 
  const product = await Product.findById(req.query.productId);      // req.query contains the URL query parameters (after the ? in the URL).
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
 
  // Review don't need can be deleted and other reviews who needed this method show reviews
  const reviews = product.reviews.filter(                        // who don't delete
    (rev) => rev._id.toString() !== req.query.id.toString()
  );


  let avg = 0;

  reviews.forEach((rev) => {              // Change rating when delete
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );


  
  res.status(200).json({
    success: true,
  });

})


export {createProduct,getAllProducts,getProductDetails,updateProduct,deleteProduct,createProductReview,getProductReviews,deleteReview}