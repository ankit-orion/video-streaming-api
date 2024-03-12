import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
    path: './.env'
})

// ! Comments
// ^ here we are using connectDB funciton and sicne it is a 
// ^ async function it will return promise
// ^ once we are connected to the database we can listen it to anyport we want


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at port ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("Mongo db connection failed !!!", err);
})  

//! Approach 1 of connecting to database
// import express from 'express'
// const app = express()
// ^ here we are using IIFE finction which runs as soon
// ^ as it is defined
// (async ()=> {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error", (error)=>{
//             console.log("Error", error);
//             throw error
//         })

//         app.listen(process.env.PORT, ()=>{
//             console.log(`App is listening on port ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.log("Error", error);
//         throw err
//     }
// })()