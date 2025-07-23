const User = require("../models/user");


module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
  };


  
module.exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        req.flash("error", "Login failed after registration.");
        return res.redirect("/signup");
      }

      const redirectUrl = req.session.redirectUrl || "/listings";  // ✅ Fallback to listings
      delete req.session.redirectUrl;

      req.flash("success", "Registered successfully, Welcome to Wanderlust!");
      res.redirect(redirectUrl); 
    });

  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};


  module.exports.renderLoginForm =(req, res) => {
  res.render("users/login.ejs");
}

module.exports.login = (req, res) => {
  const redirectUrl = req.session.returnTo || "/listings";
  delete req.session.returnTo;

  req.flash("success", "Welcome back!"); // ✅ This line was missing
  res.redirect(redirectUrl);
};



module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
}