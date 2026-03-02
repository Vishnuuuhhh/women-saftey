const Contact = require("../models/Contact");


// GET CONTACTS
exports.getContacts = async (req, res) => {

  try {

    const userId = req.userId; // FIXED

    if (!userId) {

      return res.status(401).json({
        error: "User not authenticated"
      });

    }

    const contacts = await Contact.find({ userId });

    res.json(contacts);

  }
  catch (error) {

    console.error("GET CONTACT ERROR:", error);

    res.status(500).json({
      error: "Failed to fetch contacts"
    });

  }

};



// ADD CONTACT
exports.addContact = async (req, res) => {

  try {

    const userId = req.userId; // FIXED

    const { name, phone } = req.body;

    const newContact = new Contact({

      userId,
      name,
      phone

    });

    await newContact.save();

    res.json({
      message: "Contact saved successfully"
    });

  }
  catch (error) {

    console.error("ADD CONTACT ERROR:", error);

    res.status(500).json({
      error: "Failed to save contact"
    });

  }

};
