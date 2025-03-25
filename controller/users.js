const User = require("../models/user");


// Render Signup Form
module.exports.renderSignup = (req, res) => {
  res.render("users/signup.ejs");
};


// Signup Route
module.exports.signup = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust !");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};


// Render Login Form
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};


// Login Route
module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back !");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};


// Logout Route
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "logged you out !");
    res.redirect("/listings");
  });
};
