const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listings.js");
const Review = require("./models/review.js");
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require("./utils/ExpressError");
// const { error } = require('console');
const {listingSchema , reviewSchema} = require("./schema.js");
const review = require('./models/review.js');


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
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname,"/public")))


app.get("/",(req,res)=>{
    res.send("hello i am back again after my exams")
})

const validateListing =(req,res,next)=>{
    let {error} = listingSchema.validate(req.body)
     if(error){
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg )
     } else{
        next();
     }
}


const validateReview =(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body)
     if(error){
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg )
     } else{
        next();
     }
}





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
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews');
    res.render("listings/show", { listing });
});


//create route
app.post("/listings",validateListing,
     wrapAsync(async (req, res) => {
    
    const newListing = new Listing(req.body.listing);
    
    await newListing.save();
    res.redirect("/listings");
}));

//edit route
app.get("/listings/:id/edit", async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id)
    res.render("listings/edit", { listing }) 
})

// update route
app.put("/listings/:id",validateListing,
     async (req, res) => {
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

//reviews
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${listing._id}`);
}));



app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({}).populate("reviews");
  res.render("listings/index", { allListings });
});




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


// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page not found"));
// });



app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    // res.status(statusCode).send(message);
    res.render("error.ejs",{err})
});


app.listen(8080,()=>{
    console.log("server is listening to port")
})
