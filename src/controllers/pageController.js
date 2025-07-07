const contactModel = require("../models/contactModel");
const pageModel = require("../models/pageModel");
const asyncHandler = require("express-async-handler")
//render index.ejs
exports.renderHome = (req, res) => {
    res.status(200).render("index.ejs");
}


//render register.ejs

exports.renderRegister = (req, res) => {
    res.render("register.ejs", { message: "" });
}

//render login.ejs
exports.renderLogin = (req, res) => {
    res.render("login.ejs", { message: "" });
}

//render addContact.ejs
exports.renderAddContact = (req, res) => {
    res.render("dashboard.ejs", {
        mainContent: 'addcontact',
        message: ""
    })
}

//render updateContact.ejs
exports.renderUpdateContact = async (req, res) => {
    const userid = req.user.id;
    const id = req.params.id;
    if (isNaN(id)) {
        return res.status(400).send("Invalid ID");
    }
    const result = await contactModel.getContact(id, userid)
    // console.log("hello")

    res.render("dashboard.ejs", {
        mainContent: 'updateContact',
        contact: result,
        message: "",
        success: true
    })
}
//render bin.ejs
exports.renderBin = async (req, res) => {
    const userid = req.user.id;
    let result = await pageModel.getSoftDeletedContacts(userid);
    // console.log(result)
    return res.render("dashboard.ejs", {
        mainContent: "bin",
        contacts: result,
        message:""
    });
}