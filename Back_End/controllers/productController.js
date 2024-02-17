const Product = require('../models/productModel')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError')
const APIFeatures = require('../utils/apiFeatures');


//http://localhost:8000/api/v1/products
exports.getProducts = async (req, res, next) => {
  try {
      const resPerPage = 2; // Consider making this configurable
      const apifeatures = new APIFeatures(Product.find(), req.query).search().filter().paginate(resPerPage);
      const products = await apifeatures.query.exec();
      res.status(200).json({
          success: true,
          count: products.length,
          products
      });
  } catch (error) {
      next(error); // Pass the error to the error handling middleware
  }
};


//http://localhost:8000/api/v1//products/new

exports.newProduct = catchAsyncError (async (req, res, next) => {
    const productData = req.body; // Accessing the product data from the request body
    req.body.user = req.user.id;
   await Product.create(productData)
    .then(product => {
       res.status(201).json({
          success: true,
          product
       });
    })
    .catch(error => {
       next(error);
    });
 });

 //Get single Product

//  exports.getSingleProdect = async(req,res,next) => {
//    const products = await product.findById(req.params.id)

//    if(!products){
//       res.status(404).json({
//          success:false,
//          message:"product not found"
//       });
//    }

//    res.status(201).json({
//       success: true,
//       products
//    })
//  }


exports.getSingleProdect = async (req, res, next) => {
   try {
     const product = await Product.findById(req.params.id);
 
     if (!product) {
      return next(new ErrorHandler('Product not found', 400))
     }
 
     res.status(200).json({
       success: true,
       product
     });
   } catch (error) {
     next(error)
   }
 };

 //update Product http://localhost:8000/api/v1/product/id

 exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Correcting this line
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}

// delete

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
   
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    await product.remove();

    res.status(200).json({
      success: true,
      message: "Product deleted!"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}