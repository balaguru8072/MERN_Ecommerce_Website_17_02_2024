const express = require('express');
const { getProducts, newProduct, getSingleProdect, updateProduct, deleteProduct, createReview, getReviews, deleteReview } = require('../controllers/productController');
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authenticate')

router.route('/products').get(isAuthenticatedUser,getProducts);
router.route('/product/:id')
.get(getSingleProdect)
.put(updateProduct)
.delete(deleteProduct)

router.route('/review').put(isAuthenticatedUser,createReview)
                        .delete(deleteReview)
router.route('/reviews').get(getReviews)



//admin route

router.route('/products/new').post(isAuthenticatedUser, authorizeRoles('admin'),newProduct);
module.exports = router