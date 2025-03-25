const express = require("express");
const router = express.Router({ mergeParams: true });
const mongoose = require("mongoose");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schema");
const Listing = require("../models/listing");
const Review = require("../models/review");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviewController = require("../controller/reviews");

//  Middleware to Validate Listing ID Before Queries
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ExpressError("Invalid Listing ID", 400));
  }
  next();
};

//  Post a Review
router.post(
  "/",
  isLoggedIn,
  validateObjectId,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//  Delete Review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  validateObjectId,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
