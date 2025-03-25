const Listing = require("../models/listing");

// ✅ List all Listings
module.exports.index = async (req, res) => {
  try {
    const listings = await Listing.find();
    res.render("listings/index", { allListings: listings });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving listings");
  }
};

// ✅ Render New Listing Form
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

// ✅ Show Single Listing with Reviews
module.exports.showListing = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing, currUser: req.user });
};

// ✅ Create New Listing
module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  if (!req.body.listing) {
    throw new ExpressError("Invalid listing data", 400);
  }

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();

  req.flash("success", "Successfully created a new listing!");
  res.redirect(`/listings/${newListing._id}`);
};

// ✅ Render Edit Listing Form
module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// ✅ Update Listing
module.exports.updateListing = async (req, res, next) => {
  const { id } = req.params;
  const updatedListing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );
  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = { url, filename };
    await updatedListing.save();
  }

  if (!updatedListing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

// ✅ Delete Listing
module.exports.destroyListing = async (req, res, next) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);

  if (!deletedListing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};
