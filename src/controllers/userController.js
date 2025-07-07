const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//@desc create user
//@route POST /register
//@access public
let registerUser = asyncHandler(async (req, res) => {
    let { name, email, password } = req.body;
    if (!name || !password || !email) {
        return res.render("register.ejs", { message: "All fileds are required!" });
    }
    //check email already present
    let exists = await userModel.userExists(email);
    if (exists && exists.length === 1) {
        return res.render("register.ejs", { message: "User already Exist! (_email)" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    //register
    let user = await userModel.registerUser(name, email, hashedPassword);
    if (user) {
        return res.render("register.ejs", { message: "Registration Successful!" });

    } else {
        return res.render("register.ejs", { message: "User data was invalid" })
    }

});

//@desc login user
//@route POST /login
//@access public
let loginUser = asyncHandler(async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
        return res.render("login.ejs", { message: "All fileds are required!" })
    }
    //user exist
    let user = await userModel.userExists(email);
    if (user && user.length === 1) {
        if (await bcrypt.compare(password, user[0].password)) {
            //jwt sign
            const token = jwt.sign(
                {
                    id: user[0].id,
                    email: user[0].email,
                    user: user[0].name
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "1h" }
            )
            //set jwt in cookie
            res.cookie("token", token,
                {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24
                }
            )
            // res.render("pages/dashboard.ejs",{mainContent : 'partials/viewContacts.ejs'})
            res.redirect("/contact")
        } else {
            return res.render("login.ejs", { message: "Invalid Password" })

        }
    } else {
        return res.render("login.ejs", { message: "Invalid email or User does not exist, Please register first." })
    }

});

//@desc current user
//@route POST /contact/current
//@access private
let currentUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "current user",
        user: req.user
    })

});

//@logout user
//@route 
//@access private
let logOutUser = asyncHandler(async (req, res) => {
    res.clearCookie("token")
    res.redirect("/");
})

module.exports = { registerUser, loginUser, currentUser, logOutUser };