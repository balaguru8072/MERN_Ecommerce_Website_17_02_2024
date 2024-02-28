const Product = require('../models/productModel')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError')
const APIFeatures = require('../utils/apiFeatures');


//http://localhost:8000/api/v1/products
exports.getProducts = catchAsyncError(async (req, res, next)=>{
  const resPerPage = 4;
  
  let buildQuery = () => {
      return new APIFeatures(Product.find(), req.query).search().filter()
  }
  
  const filteredProductsCount = await buildQuery().query.countDocuments({})
  const totalProductsCount = await Product.countDocuments({});
  let productsCount = totalProductsCount;

  if(filteredProductsCount !== totalProductsCount) {
      productsCount = filteredProductsCount;
  }
  
  const products = await buildQuery().paginate(resPerPage).query;

  res.status(200).json({
      success : true,
      count: productsCount,
      resPerPage,
      products
  })
})


//http://localhost:8000/api/v1//products/new

exports.newProduct = catchAsyncError(async (req, res, next) => {
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

// http://loaclhost:8000/api/v1/product/id
exports.getSingleProdect = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler('Product not found', 400))
    }

    await new Promise(resolve=>setTimeout(resolve,3000))
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

//Create Review http://localhost:8000/api/v1/review
// {
//   "rating": 3.5,
//   "comment": "Product quality is good! but packaging is bad",
//   "productId": "65c787272c3f22ba47ed36b2"
// }

exports.createReview = catchAsyncError(async (req, res, next) => {
  const { productId, rating, comment } = req.body;
  
  // Validate input data
  if (!productId || !rating || !comment) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ success: false, error: "Product not found" });
  }

  const existingReview = product.reviews.find(review => review.user.toString() === req.user.id.toString());

  if (existingReview) {
    // Update existing review
    existingReview.comment = comment;
    existingReview.rating = rating;
  } else {
    // Create new review
    product.reviews.push({ user: req.user.id, rating, comment });
    product.numOfReviews = product.reviews.length;
  }

  // Calculate average rating
  const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0);
  product.ratings = totalRating / product.reviews.length || 0;

  await product.save();

  res.status(200).json({ success: true });
});

//Get Reviews http://localhost:8000/api/v1/reviews?id=65c787272c3f22ba47ed36b2   (this id is product id review product id )
exports.getReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id)

  res.status(200).json({
    success: true,
    reviews: product.reviews
  })
})

//Delete Review http://localhost:8000/api/v1/review?id=65d0d5eced9d3618e9dcf7ac&productId=65c787272c3f22ba47ed36b2
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  // Filter out the review with the provided id
  const reviews = product.reviews.filter(review => {
    return review._id.toString() !== req.query.id.toString();
  });

  // Update the number of reviews
  const numOfReviews = reviews.length;

  // Calculate the new average rating
  const newRating = reviews.reduce((acc, review) => {
    return review.rating + acc;
  }, 0) / (reviews.length || 1); // Avoid dividing by zero

  // Save the updated product document
  await Product.findByIdAndUpdate(req.query.productId, {
    reviews,
    numOfReviews,
    ratings: isNaN(newRating) ? 0 : newRating // Fix typo and handle NaN case
  });

  res.status(200).json({
    success: true
  });
})
