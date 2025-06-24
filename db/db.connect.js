const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri= process.env.MONGODB;

const initializeDatabase = async () =>{
    try{
        const connection = await mongoose.connect(mongoUri,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });

        if(connection){
            console.log("MongoDB Database connected successfully")
        }
    }catch(error){
        console.log("Database connection failed: ",error);
    }
}

module.exports = {initializeDatabase};