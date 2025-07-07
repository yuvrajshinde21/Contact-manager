const express = require("express");
let router = express.Router();
let userController = require("../controllers/userController");
const validateToken = require("../middleware/authMiddleware")

let { registerUser, loginUser, currentUser,logOutUser } = userController;

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/current").get(validateToken, currentUser);//--private route

router.route("/logout").get(validateToken,logOutUser);

module.exports = router;








