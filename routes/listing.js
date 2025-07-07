const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const {listingSchema , reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listings.js");




const validateListing =(req,res,next)=>{
    let {error} = listingSchema.validate(req.body)
     if(error){
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg )
     } else{
        next();
     }
}





//index route
router.get("/",async(req,res)=>{
    const allListings = await Listing.find({})
    res.render("listings/index", { allListings })  
    
})


//new route
router.get("/new",(req,res)=>{
    res.render("listings/new")
})

//show route
router.get("/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews');
    res.render("listings/show", { listing });
});

//create route
router.post("/",validateListing,
     wrapAsync(async (req, res) => {
    
    const newListing = new Listing(req.body.listing);
    
    await newListing.save();
    res.redirect("/listings");
}));

//edit route
router.get("/:id/edit", async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id)
    res.render("listings/edit", { listing }) 
})

// update route
router.put("/:id",validateListing,
     async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});

//delete route
router.delete("/:id", async (req, res) => {
    let { id } = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id)
    res.redirect("/listings")
})

module.exports = router;