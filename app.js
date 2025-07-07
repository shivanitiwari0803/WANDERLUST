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
const listings =require("./routes/listing.js")


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




const validateReview =(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body)
     if(error){
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg )
     } else{
        next();
     }
}

app.use("/listings",listings)










//reviews
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${listing._id}`);
}));





//reviews delete
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));



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
