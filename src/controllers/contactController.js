const asyncHandler = require("express-async-handler");
const contactModel = require("../models/contactModel");
const pageModel = require("../models/pageModel");

//@desc get all contacts
//@route GET  /contact-manager/
//@access private
let getContacts = asyncHandler(async (req, res) => {
    const userid = req.user.id;
    let contacts = await contactModel.getContacts(userid);
    if (!contacts || contacts.length === 0) {
        return res.render("dashboard.ejs", {
            mainContent: 'viewContacts',
            contacts
        })
    }
    // console.log(contacts);
    res.render("dashboard.ejs", {
        mainContent: 'viewContacts',//dont write .ejs here
        contacts: contacts
    })
});

//@desc create contacts
//@route POST /contact-manager/
//@access private
let createContact = asyncHandler(async (req, res) => {
    const userid = req.user.id;
    let { firstname, lastname, email, phone, address, birthday, notes } = req.body;
    //validate input
    phone = parseInt(phone.trim());
    if (!firstname || !phone) {
        return res.render("dashboard.ejs", {
            mainContent: 'addcontact', message: "First name and phone is required!", success: false
        })
    }
    //check email duplicate
    let isDuplicateEmail = await contactModel.checkDulpicateEmail(email, 0, userid);
    if (isDuplicateEmail.length > 0) {
        return res.render("dashboard.ejs", {
            mainContent: "addcontact",
            message: `duplicate email : ${email}`,
            success: false,
        })
    }
    //TODO=check duplicate
    let isDuplicatePhone = await contactModel.checkDulpicatePhone(phone, 0, userid);
    if (isDuplicatePhone.length > 0) {
        return res.render("dashboard.ejs", {
            mainContent: "addcontact",
            message: `duplicate name : ${phone}`,
            success: false,
        })
    }
    //insert contact
    let result = await contactModel.createContact(firstname, lastname, email, phone, address, birthday, notes, userid);    //result.affectedRows===1
    return res.render("dashboard.ejs", { mainContent: 'addcontact', message: "Contact created successfully!", success: true })
});

//@desc get contact
//@route GET /contact/:id
//@access private
let getContact = asyncHandler(async (req, res) => {
    let id = req.params.id;
    const userid = req.user.id;
    //validate input
    if (isNaN(id)) {
        res.status(400);
        throw new Error("Invalid id format");
    }
    let result = await contactModel.getContact(id, userid);
    //
    if (!result || result.length === 0) {
        res.status(404)
        throw Error("contact not found!")
    }
    console.log(result[0])
    res.render("showContact.ejs", { data: result });

});

//@desc update contact
//@route post /contact-manager/:id
//@access private
let updateContact = asyncHandler(async (req, res) => {
    let id = req.params.id;
    const userid = req.user.id;

    //validate input
    if (isNaN(id)) {
        res.status(400);
        console.log("Invalid id format")
    }
    let { firstname, lastname, email, phone, address, birthday, notes } = req.body;
    //validate firlds
    if (!firstname || !phone) {
        return res.render("dashboard.ejs", {
            mainContent: 'updateContact',
            message: "First email and phone is required!",
            success: false,
            contact: { firstname, lastname, email, phone, address, birthday, notes }
        })
    }
    if (!birthday) {
        birthday = null
    }
    //phone duplicate
    let existingEmail = await contactModel.checkDulpicateEmail(email, id, userid);
    if (existingEmail.length > 0) {
        return res.render("dashboard.ejs", {
            mainContent: "updateContact",
            message: "duplicate email",
            success: false,
            contact: { firstname, lastname, email, phone, address, birthday, notes }
        })
    }

    //check email   
    let existingPhone = await contactModel.checkDulpicatePhone(phone, id, userid);
    if (existingPhone.length > 0) {
        return res.render("dashboard.ejs", {
            mainContent: "updateContact",
            message: "duplicate  phone",
            success: false,
            contact: { firstname, lastname, email, phone, address, birthday, notes }
        })
    }

    let result = await contactModel.updateContact(firstname, lastname, email, phone, address, birthday, notes, id, userid);
    if (result.affectedRows === 0) {
        return res.render("dashboard.ejs", {
            mainContent: "updateContact",
            message: "Error Contact can not able to update",
            success: false,
            contact: { firstname, lastname, email, phone, address, birthday, notes }
        })
    }
    res.redirect("/contact");
});

//@desc soft delete contact
//@route DELETE /contact-manager/:id
//@access private
let deleteContact = asyncHandler(async (req, res) => {
    let id = req.params.id;
    const userid = req.user.id;
    let result = await contactModel.deleteContact(id, userid);
    if (result.affectedRows === 0) {
        return res.json({ message: "contact not found" })
    }
    res.status(200).json({ message: 'Contact deleted successfully' });

});

//@desc search 
//@roure get /contact/:first_name,last_name,email
//@access private
let search = asyncHandler(async (req, res) => {
    const userid = req.user.id;
    const val = req.params.val.trim();

    let result = await contactModel.search(val, userid);
    res.json(result);
})

//@desc permentaly delete contact or restore from bin
//@route post /contact/bin/action
//@access private
let restoreAndDelete = asyncHandler(async (req, res) => {
    console.log(req.body)
    const { selectedId, email, phone, action } = req.body;    //{ selectedId: [ '150', '151' ], action: 'restore' }
    const userid = req.user.id;

    if (!selectedId) {
        return res.redirect("/bin")
    }

    const ids = Array.isArray(selectedId) ? selectedId : [selectedId];//if not array make it array for consistency(when only one value selected)
    const emails = Array.isArray(email) ? email : [email];
    const phones = Array.isArray(phone) ? phone : [phone];
    if (action && action === "restore") {
        for (const i = 0; i < email.length; i++) {

            const duplicateEmail = await contactModel.checkDulpicateEmail(emails[i], ids[i], userid);
            if (duplicateEmail && duplicateEmail.length > 0) {
                let result = await pageModel.getSoftDeletedContacts(userid);
                return res.render("dashboard.ejs", {
                    mainContent: "bin",
                    contacts: result,
                    message: `contact already exist with this ${emails[i]} :Delete any one.`
                });
            }
            const duplicatePhone = await contactModel.checkDulpicatePhone(phones[i], ids[i], userid);
            if (duplicatePhone && duplicatePhone.length > 0) {
                let result = await pageModel.getSoftDeletedContacts(userid);
                return res.render("dashboard.ejs", {
                    mainContent: "bin",
                    contacts: result,
                    message: `contact already exist with this ${phones[i]} :Delete any one.`
                });
            }
            await contactModel.restoreContacts(ids[i], userid)
        }
        let result = await pageModel.getSoftDeletedContacts(userid);
        return res.render("dashboard.ejs", {
            mainContent: "bin",
            contacts: result,
            message: "successfully restored"
        });
    }
    if (action && action === "delete") {
        for (const id of ids) {
            await contactModel.deleteContactFromBin(id, userid)
        }
        let result = await pageModel.getSoftDeletedContacts(userid);
        return res.render("dashboard.ejs", {
            mainContent: "bin",
            contacts: result,
            message: "contact deleted permently"
        });
    }

    // res.redirect("/bin")
});

module.exports = {
    getContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact,
    search,
    restoreAndDelete
};