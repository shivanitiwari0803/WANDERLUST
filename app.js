const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listings.js");



const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to DB")
})
.catch((err)=>{
    console.log(err)
})

async function main() {
    await mongoose.connect(MONGO_URL)
    
}



app.get("/",(req,res)=>{
    res.send("hello i am back again after my exams")
})

app.get("/testlistings", async (req,res)=>{
    let sampleListing = new Listing({
        title : "My New House",
        Description : "by the road",
        price : 3400,
        location :"paris",
        country : "Europe"
    })
   await sampleListing.save();
   console.log("sample was saved ")
   res.send("successfully saved")
})



app.listen(8080,()=>{
    console.log("server is listening to port")
})
