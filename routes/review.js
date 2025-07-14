const express = require('express');
const router = express.Router({mergeParams :true});
const wrapAsync = require('../utils/wrapAsync.js');
const {listingSchema , reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listings.js");
const Review = require("../models/review.js");
const { isLoggedIn ,isReviewAuthor} = require('../middleware.js');
const validateReview = require('../middleware.js').validateReview;

 
//reviews
router.post("/",isLoggedIn,
    validateReview, wrapAsync(async (req, res) => {
  console.log(req.params.id)
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
   req.flash("success", "New Review created !")


  res.redirect(`/listings/${listing._id}`);
}));


//reviews delete
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted!");
  res.redirect(`/listings/${id}`);
}));


module.exports = router 