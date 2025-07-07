const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const validateToken = require("../middleware/authMiddleware");
let { getContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact,
    search,
    restoreAndDelete} = contactController;

router.use(validateToken); // All routes below are protected

router.get("/search/:val", search);
router.get("/", getContacts);
router.post("/", createContact);
router.get("/:id", getContact);
router.post("/:id", updateContact);
router.delete("/:id", deleteContact);


router.route("/bin/action").post(restoreAndDelete);






// router.route("/").get(getContacts).post(createContact);

// router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);
module.exports = router;