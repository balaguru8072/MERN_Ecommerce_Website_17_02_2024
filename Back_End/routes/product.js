const express = require('express');
const { getProducts, newProduct, getSingleProdect, updateProduct, deleteProduct } = require('../controllers/productController');
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authenticate')

router.route('/products').get(isAuthenticatedUser,getProducts);
router.route('/product/:id')
.get(getSingleProdect)
.put(updateProduct)
.delete(deleteProduct)

//admin route

router.route('/products/new').post(isAuthenticatedUser, authorizeRoles('admin'),newProduct);
module.exports = router