import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";


dotenv.config();

connectDB()
.then (()=>{
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    }); 
    app.on("error", (err) => {
        console.error("Error connecting to MongoDB:", err);
        throw err;
    });
})
.catch((error) => {
    console.log("Error connecting to MongoDB:", error);
})





/*
import express from "express";
const app = express();

//effies
;(async ()=> {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_Name}`)
        app.on("error", (err) => {
            console.error("Error connecting to MongoDB:", err);
            throw err;
        })

        app.listen(process.env.PORT,()=>{
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.error("Error", error);
        throw error;
    }
})()
    */
   