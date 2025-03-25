const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://localhost:27017/airbnb";

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log(err));

const initDB = async () => {
  await Listing.deleteMany({}); //deleteMany:- deletes all the documents that match the specified condition
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "67c871bababecd04beb6c1d9",
  }));
  await Listing.insertMany(initData.data); //insertMany:- inserts multiple documents into the collection
  console.log("Database initialized");
};
initDB();
