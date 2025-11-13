const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();
const db_connect=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}
module.exports=db_connect;