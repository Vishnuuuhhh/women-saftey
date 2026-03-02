const express = require("express");
const router = express.Router();

const Contact = require("../models/Contact");
const authMiddleware = require("../middleware/auth");


// GET all contacts
router.get("/contacts", authMiddleware, async (req, res) => {

  try {

    const contacts = await Contact.find({
      userId: req.userId
    }).sort({ createdAt: -1 });

    res.json(contacts);

  }
  catch {

    res.status(500).json({
      error: "Failed to fetch contacts"
    });

  }

});


// ADD contact
router.post("/contacts", authMiddleware, async (req, res) => {

  try {

    const { name, phone } = req.body;

    const newContact = new Contact({

      userId: req.userId,
      name,
      phone

    });

    await newContact.save();

    res.json({
      message: "Contact added"
    });

  }
  catch {

    res.status(500).json({
      error: "Failed to add contact"
    });

  }

});


// DELETE contact
router.delete("/contacts/:id", authMiddleware, async (req, res) => {

  try {

    await Contact.deleteOne({

      _id: req.params.id,
      userId: req.userId

    });

    res.json({
      message: "Contact deleted successfully"
    });

  }
  catch {

    res.status(500).json({
      error: "Failed to delete contact"
    });

  }

});


module.exports = router;
