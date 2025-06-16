const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listings.js");
const path = require("path")
const methodOverride = require("method-override")



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

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended : true}))
app.use(methodOverride("_method"))


app.get("/",(req,res)=>{
    res.send("hello i am back again after my exams")
})

//index route
app.get("/listings",async(req,res)=>{
    const allListings = await Listing.find({})
    res.render("listings/index", { allListings })  
    
})


//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new")
})

//show route
app.get("/listings/:id", async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id)
    res.render("listings/show", { listing })  
})

//create route
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
     await newListing.save();
     res.redirect("/listings")

})
//edit route
app.get("/listings/:id/edit", async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id)
    res.render("listings/edit", { listing }) 
})

// update route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id)
    res.redirect("/listings")
})


// app.get("/testlistings", async (req,res)=>{
//     let sampleListing = new Listing({
//         title : "My New House",
//         Description : "by the road",
//         price : 3400,
//         location :"paris",
//         country : "Europe"
//     })
//    await sampleListing.save();
//    console.log("sample was saved ")
//    res.send("successfully saved")
// })



app.listen(8080,()=>{
    console.log("server is listening to port")
})
