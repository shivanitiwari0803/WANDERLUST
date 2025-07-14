const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const {listingSchema , reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listings.js");
const { isLoggedIn, isOwner,validateListing } = require('../middleware.js');


//index route
router.get("/",async(req,res)=>{
    const allListings = await Listing.find({})
    res.render("listings/index", { allListings })  
    
})


//new route
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new")})



//show route
router.get("/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path: 'reviews',populate:{
    path: 'author', select: 'username'
  }}).populate('owner', 'username'); 
  if (!listing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings"); 
  }
  res.render("listings/show", { listing });
});


//create route
router.post("/", validateListing,
    wrapAsync(async (req, res) => {
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New listing created !");
        res.redirect("/listings");
    })
);

//edit route
router.get("/:id/edit",isLoggedIn,isOwner, async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id)
    res.render("listings/edit", { listing }) 
})

// update route
router.put("/:id",isLoggedIn,isOwner,validateListing,
     async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated !")

    res.redirect(`/listings/${id}`);
});

//delete route
router.delete("/:id",isLoggedIn,isOwner,
   async (req, res) => {
    let { id } = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id)
    req.flash("success", "Listing deleted !")

    res.redirect("/listings")
})

module.exports = router;