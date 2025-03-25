if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
console.log("🔍 MongoDB Connection String:", process.env.ATLASDB_URL);
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const ExpressError = require("./utils/ExpressError");
const Session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const userRouter = require("./routes/user");

const listingsRouter = require("./routes/listings");
const reviewsRouter = require("./routes/reviews");

const app = express();
const PORT = 3000;

// ✅ Connect to MongoDB
mongoose
  //.connect("mongodb://127.0.0.1:27017/airbnb")
  .connect(process.env.ATLASDB_URL)

  .then(() => console.log("✅ MongoDB is connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const store = MongoStore.create({
  mongoUrl: process.env.ATLASDB_URL,
  crypto: {
    secret: process.env.MONGO_SECRET,
  },
  touchAfter: 24 * 3600,
});
store.on("error", function (e) {
  console.log("Session Store Error", e);
});

const sessionOptions = {
  store,
  secret: process.env.MONGO_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

// ✅ Set View Engine & Middleware
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ✅ Routes
app.use(Session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  console.log(res.locals.success);
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// ✅ Default Home Route
app.get("/", (req, res) => {
  res.redirect("/listings"); // Redirect to main listings page
});

// ✅ Global 404 Error Handler
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error", { err });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
