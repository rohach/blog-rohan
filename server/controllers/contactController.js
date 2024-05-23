const Contact = require("../models/contactModel");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");

// Create Contact
exports.createContact = async (req, res, next) => {
  try {
    const contactData = req.body;
    let user = await User.findOne({ email: contactData.userEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    contactData.user = user._id;
    contactData.userName = contactData.userName;
    const contact = await Contact.create(contactData);

    res.status(201).json({
      success: true,
      message: "Contact message sent!",
      contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send message!",
    });
  }
};

// Get All Contacts
exports.getAllContact = async (req, res, next) => {
  try {
    const contact = await Contact.find().sort({ createdAt: -1 });
    if (contact) {
      res.status(200).json({
        success: true,
        contact,
      });
    } else {
      return next(new ErrorHandler("Failed to get all contact messages", 400));
    }
  } catch (error) {
    return next(new ErrorHandler("Failed to get all contact messages", 400));
  }
};

// Get Single Contact Detail
exports.getSingleContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found message!",
      });
    }
    res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to get Contact message!",
    });
  }
};

// Delete a Contact Message
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact Message not found!",
      });
    }

    await contact.remove();

    res.status(200).json({
      success: true,
      message: "Contact message deleted!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to delete the Contact message!",
    });
  }
};
