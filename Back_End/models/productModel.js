const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "please Enter the product name"],
        trim:true,
        maxLength: [100, "product name cannot exceed 100 characters"]
    },
    price:{
        type: Number,
        required:true,
        default: 0.0
    },
    description: {
        type: String,
        required:[true, "please enter product description"]
    },
    ratings: {
        type: String,
        default: 0
    },
    images: [
        {
            image:{
                type: String,
                required:true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "please enter product category"],
        enum:{
            values:[
                'Electronics',
                'Mobile Phones',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Home'
            ],
            message: "please Select correct category"
        }
    },
    seller: {
        type: String,
        required: [true, "please enter product seller"]
    },
    stock: {
        type: Number,
        required: [true, "please enter product stock"],
        maxLength: [20, 'product stock cannot exceed 20']
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user:{
                type: mongoose .Schema.Types.ObjectId
            },
            rating: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose .Schema.Types.ObjectId
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
});

// Corrected export statement
module.exports = mongoose.model('Product', productSchema);
