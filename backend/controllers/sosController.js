const SOS = require("../models/SOS");
const Contact = require("../models/Contact");
const User = require("../models/User");
const twilioClient = require("../config/twilio");

exports.sendSOS = async (req, res) => {
  try {

    const { latitude, longitude, mapsLink, time } = req.body;

    const userId = req.userId;

    console.log("SOS from user:", userId);

    // Get user info
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    // Save SOS
    const newSOS = new SOS({
      userId,
      latitude,
      longitude,
      mapsLink,
      time,
      status: "Active"
    });

    await newSOS.save();

    console.log("SOS saved in DB");

    // Get contacts
    const contacts = await Contact.find({ userId });

    console.log("Found contacts:", contacts.length);

    // Send SMS
    for (const contact of contacts) {

      const message =
        `🚨 EMERGENCY ALERT 🚨\n\n` +
        `${user.name} needs help immediately!\n\n` +
        `📍 Live Location:\n${mapsLink}\n\n` +
        `Please check immediately.`;

      try {

        await twilioClient.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE,
          to: `+91${contact.phone}`
        });

        console.log("SMS sent to:", contact.phone);

      }
      catch (error) {
        console.error("SMS failed:", error.message);
      }
    }

    res.json({
      message: "SOS sent successfully"
    });

  }
  catch (error) {

    console.error("SOS ERROR:", error);

    res.status(500).json({
      error: "SOS failed"
    });

  }
};
