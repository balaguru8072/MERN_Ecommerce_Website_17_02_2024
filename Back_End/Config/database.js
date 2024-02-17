const mongoose = require('mongoose');


const connectDatabase = () => {
    mongoose.connect("mongodb://127.0.0.1:27017/balaecommerce", {
        useNewUrlParser: "true",
        useUnifiedTopology: "true"
    }).then(con => {
        console.log(`mongoDB is connected successfully: ${con.connection.host}`)
    })
}

module.exports = connectDatabase;