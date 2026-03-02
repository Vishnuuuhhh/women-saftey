const SOS = require("../models/SOS");
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const { sendSOS } = require("../controllers/sosController");

// SEND SOS
router.post("/sos", authMiddleware, sendSOS);

module.exports = router;
router.put("/sos/update", authMiddleware, async (req, res) => {

  try {

    const { latitude, longitude, mapsLink } = req.body;

    const sos = await SOS.findOneAndUpdate(
      {
        userId: req.userId,
        status: "Active"
      },
      {
        latitude,
        longitude,
        mapsLink,
        time: new Date()
      },
      {
        new: true
      }
    );

    if (!sos) {
      return res.status(404).json({
        error: "No active SOS found"
      });
    }

    console.log("SOS location updated");

    res.json({
      message: "Location updated"
    });

  }
  catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Update failed"
    });

  }

});
router.put("/sos/stop", authMiddleware, async (req, res) => {

  try {

    await SOS.findOneAndUpdate(
      {
        userId: req.userId,
        status: "Active"
      },
      {
        status: "Stopped"
      }
    );

    res.json({
      message: "SOS stopped"
    });

  }
  catch {

    res.status(500).json({
      error: "Stop failed"
    });

  }

});
// GET SOS HISTORY
router.get("/sos/history", authMiddleware, async (req, res) => {

  try {

    const history = await SOS.find({
      userId: req.userId
    })
    .sort({ time: -1 });

    res.json(history);

  }
  catch (error) {

    res.status(500).json({
      error: "Failed to fetch history"
    });

  }

});
