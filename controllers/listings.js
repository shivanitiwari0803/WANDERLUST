const Listing = require("../models/listings.js");



module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = async (req,res)=>{
    res.render("listings/new")
}

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
        select: 'username', 
      }
    })
    .populate('owner', 'username'); 
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
};


module.exports.createListing = async (req, res) => {
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New listing created !");
        res.redirect("/listings");
    }


module.exports.editListing =async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id)
    res.render("listings/edit", { listing }) 
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated !")

    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id)
    req.flash("success", "Listing deleted !")

    res.redirect("/listings")
}