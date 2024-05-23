const {
  createContact,
  getAllContact,
  getSingleContact,
  deleteContact,
} = require("../controllers/contactController");

const router = require("express").Router();

// Create Contact
router.route("/addContact").post(createContact);

// Get all Contacts
router.route("/contacts").get(getAllContact);

// Get single Contact
router.route("/contact/:id").get(getSingleContact).delete(deleteContact);

module.exports = router;
