const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema");
const Listing = require("../models/listing");
const {
  isLoggedIn,
  isOwner,
  validateListing,
  validateObjectId,
} = require("../middleware");
const User = require("../models/user");
const listingController = require("../controller/listings");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(listingController.index)
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// ✅ Render New Listing Form
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(validateObjectId, wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateObjectId,
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    validateObjectId,
    wrapAsync(listingController.destroyListing)
  );

// ✅ Render Edit Listing Form
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  validateObjectId,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;

//previous code

// const express = require("express");
// const router = express.Router();
// const mongoose = require("mongoose");
// const wrapAsync = require("../utils/wrapAsync");
// const ExpressError = require("../utils/ExpressError");
// const { listingSchema } = require("../schema");
// const Listing = require("../models/listing");
// const {
//   isLoggedIn,
//   isOwner,
//   validateListing,
//   validateObjectId,
// } = require("../middleware");
// const User = require("../models/user");

// // ✅ List all Listings
// router.get("/", async (req, res) => {
//   try {
//     const listings = await Listing.find();
//     res.render("listings/index", { allListings: listings });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error retrieving listings");
//   }
// });

// // ✅ Render New Listing Form
// router.get("/new", isLoggedIn, (req, res) => {
//   console.log(req.user);

//   res.render("listings/new");
// });

// // ✅ Show Single Listing with Reviews
// router.get("/:id", validateObjectId, async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const listing = await Listing.findById(id)
//       .populate("reviews")
//       .populate("owner");
//     if (!listing) {
//       req.flash("error", "Listing you requested for does not exist !");
//       return res.redirect("/listings");
//     }
//     console.log(listing);
//     res.render("listings/show", { listing });
//   } catch (err) {
//     console.error(err);
//     req.flash("error", "Something went wrong");
//     res.redirect("/listings");
//   }
// });

// // ✅ Create New Listing
// router.post(
//   "/",
//   validateListing,
//   wrapAsync(async (req, res, next) => {
//     if (!req.body.listing) {
//       throw new ExpressError("Invalid listing data", 400);
//     }
//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;
//     await newListing.save();
//     req.flash("success", "Successfully created a new listing!");
//     res.redirect("/listings");
//   })
// );

// // ✅ Render Edit Listing Form
// router.get(
//   "/:id/edit",
//   isLoggedIn,
//   isOwner,
//   validateObjectId,
//   wrapAsync(async (req, res, next) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id);

//     if (!listing) {
//       req.flash("error", "Listing you requested for does not exist !");
//       return res.redirect("/listings");
//     }
//     res.render("listings/edit.ejs", { listing });
//   })
// );

// // ✅ Update Listing
// router.put(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   validateObjectId,
//   validateListing,
//   wrapAsync(async (req, res, next) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id);
//     if (!listing) {
//       req.flash("error", "Listing you requested for does not exist !");
//       return res.redirect("/listings");
//     }
//     const updatedListing = await Listing.findByIdAndUpdate(
//       id,
//       { ...req.body.listing },
//       { new: true }
//     );

//     req.flash("success", "Listing updated!");
//     res.redirect(`/listings/${id}`);
//   })
// );

// // ✅ Delete Listing
// // router.delete(
// //   "/:id",
// //   isLoggedIn,
// //   isOwner,
// //   validateObjectId,
// //   wrapAsync(async (req, res, next) => {
// //     const { id } = req.params;
// //     const deletedListing = await Listing.findByIdAndDelete(id);
// //     req.flash("success", "Listing deleted!");
// //     if (!listing) {
// //       req.flash("error", "Listing you requested for does not exist !");
// //       return res.redirect("/listings");
// //     }
// //     res.redirect("/listings");
// //   })
// // );

// // ✅ Delete Listing
// router.delete(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   validateObjectId,
//   wrapAsync(async (req, res, next) => {
//     const { id } = req.params;
//     const deletedListing = await Listing.findByIdAndDelete(id);

//     if (!deletedListing) {
//       req.flash("error", "Listing you requested for does not exist !");
//       return res.redirect("/listings");
//     }

//     req.flash("success", "Listing deleted!");
//     res.redirect("/listings");
//   })
// );

// module.exports = router;
