const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.createReview = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return next(new ExpressError("Listing not found", 404));
    }
    const review = new Review(req.body.review);
    review.author = req.user._id;
    console.log(review);
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success", "Review created!");

    res.redirect(`/listings/${id}`);
  }

  module.exports.destroyReview = async (req, res, next) => {
    const { id, reviewId } = req.params;

    // 🔥 Fix: Ensure the listing exists before deleting a review
    const listing = await Listing.findById(id);
    if (!listing) {
      return next(new ExpressError("Listing not found", 404));
    }
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");

    res.redirect(`/listings/${id}`);
  }