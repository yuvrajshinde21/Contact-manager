const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/authMiddleware")
const pageController = require("../controllers/pageController");

//@render home page
router.route("/").get(pageController.renderHome);
//render register.ejs
router.route("/register").get(pageController.renderRegister);
//render login.ejs
router.route("/login").get(pageController.renderLogin);

// router.use(validateToken);

//create contact page
router.route("/add").get(validateToken,pageController.renderAddContact);

//go to update page
router.route("/edit/:id").get(validateToken,pageController.renderUpdateContact)

//render bin.ejs
router.route("/bin").get(validateToken,pageController.renderBin)


//----------------------

module.exports = router;

