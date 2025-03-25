const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  //schema:- defines the structure of the document
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  // image: {
  //   type: String, // Now it stores just a URL string
  //   required: false,
  //   default: "https://images.unsplash.com/default-image-url.jpg",
  // },
  // image: [
  //   {
  //     type: String,
  //     required: false,
  //     default: "https://images.unsplash.com/default-image-url.jpg",
  //     set: (v) => {
  //       v == "" ? "https://images.unsplash.com/default-image-url.jpg" : v;
  //     },
  //   },
  // ],

  image: {
    url: String,
    filename: String,
  },

  price: {
    type: Number,
    min: [0, "Price must be a positive number"],
  },
  location: {
    type: String,
    required: [true, "Location is required"],
  },
  country: {
    type: String,
    required: [true, "Country is required"],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema); //model:- a constructor function that creates instances of documents
module.exports = Listing; //export the listing model
