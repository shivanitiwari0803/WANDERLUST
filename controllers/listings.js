const Listing = require("../models/listings.js");



module.exports.index = async (req, res) => {
  const { category } = req.query;
  let allListings;

  if (category) {
    allListings = await Listing.find({ category });
  } else {
    allListings = await Listing.find({});
  }

  res.render("listings/index", { allListings, category }); // pass category to EJS
};




module.exports.renderNewForm = async (req, res) => {
  res.render("listings/new");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
        select: "username",
      },
    })
    .populate("owner", "username");
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
};

module.exports.createListing = async (req, res, next) => {
  try {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {
      url,
      filename,
    };

    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    await newListing.save();

    req.flash("success", "New listing created!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  let originalImageUrl = "";

  if (listing.image && listing.image.url) {
    originalImageUrl = listing.image.url.replace(
      "/upload",
      "/upload/q_30,w_250,h_300,f_auto"
    );
  }

  res.render("listings/edit", { listing, originalImageUrl });
};




module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename,};
    await listing.save();
  }

  req.flash("success", "Listing updated !");

  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedlisting = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted !");

  res.redirect("/listings");
};
