const Products = require('../data/products.json');
const productModel = require('../models/productModel');
const connectDatabase = require("../Config/database")
const dotenv = require('dotenv');

dotenv.config({path: 'Back_End/config/config.env'});
connectDatabase();




const seedProducts =  async () =>{

    try {
        
        await productModel.deleteMany();
        console.log("products deleted")
    
        await productModel.insertMany(Products);
        console.log("All product added")
    } catch (error) {
        console.log(error.message)
    }
    process.exit();
}

seedProducts();