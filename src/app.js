const express = require("express");
const cookieparser = require("cookie-parser")
;
const app = express();

let contactRoutes = require("../src/routes/contactRoutes.js");
let userRoutes = require("../src/routes/userRoutes.js");
const pageRoutes = require("../src/routes/pageRoutes.js");
let errhandler = require("./middleware/errhandler.js");


app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieparser())

app.use("/",pageRoutes);
app.use("/contact",contactRoutes);
app.use("/user",userRoutes);

app.use(errhandler);


module.exports = app;
//add catagory - emergency,friend,business,...
//pagination
//photo
//add view in showcontact page
//block and blacklist
//multiple phone no, address, email
//history