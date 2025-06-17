import dotenv from "dotenv";
import connectDB from "./db/index.js";


dotenv.config();

connectDB();





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
   