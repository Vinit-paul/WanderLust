const User = require("./models/user");
const Listing = require("./models/listing");
const { listingSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError");
const mongoose = require("mongoose");
const { reviewSchema } = require("./schema.js");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.orginalUrl;
    req.flash("error", "You must be signed in to create a new listing!");
    return res.redirect("/login");
  }
  next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    req.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You do not have permission to do that !");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// module.exports.validateListing = (req, res, next) => {
//   const { error } = listingSchema.validate(req.body.listing);
//   if (error) {
//     const msg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(msg, 400);
//   } else {
//     next();
//   }
// };

module.exports.validateListing = (req, res, next) => {
  console.log("Received req.body:", JSON.stringify(req.body, null, 2)); // Debugging log

  if (!req.body.listing) {
    throw new ExpressError("Listing data is missing", 400);
  }

  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  }
  next();
};

module.exports.validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ExpressError("Invalid Listing ID", 400));
  }
  next();
};

// module.exports.validateReview = (req, res, next) => {
//   console.log("Received req.body:", req.body); // Debugging line

//   const { error } = reviewSchema.validate(req.body.review);
//   if (error) {
//     const msg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(msg, 400);
//   } else {
//     next();
//   }
// };

module.exports.validateReview = (req, res, next) => {
  console.log("Received req.body:", JSON.stringify(req.body, null, 2)); // Debugging log

  if (!req.body.review) {
    throw new ExpressError("Review data is missing", 400);
  }

  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You do not have permission to do that !");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
