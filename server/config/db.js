const mongoose = require("mongoose");

const  connectDB = async ()=>{
    try {
        const con = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`mongoDB connected ${con.connection.host}`);
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;