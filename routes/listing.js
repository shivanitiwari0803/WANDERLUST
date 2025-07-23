const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listings.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({storage});


router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("image"),            
    validateListing,                  
    wrapAsync(listingController.createListing) 
  );

  //new route
  router.get("/new", isLoggedIn, listingController.renderNewForm);



// Search by country route
router.get("/search", async (req, res) => {
  const { country } = req.query;
  try {
    let allListings = [];

    if (country) {
      allListings = await Listing.find({
        country: { $regex: new RegExp(country, "i") }, // case-insensitive match
      });
    } else {
      allListings = await Listing.find(); // fallback to all listings
    }

    res.render("listings/index", { allListings }); // pass correctly to EJS
  } catch (err) {
    console.error("Search failed:", err);
    res.redirect("/listings");
  }

  console.log("Search query:", req.query);
});




  
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),            

    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

  
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);



module.exports = router;
