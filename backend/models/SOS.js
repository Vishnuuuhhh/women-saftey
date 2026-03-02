const mongoose = require("mongoose");

const sosSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  latitude: {
    type: Number,
    required: true,
  },

  longitude: {
    type: Number,
    required: true,
  },

  mapsLink: {
    type: String,
    required: true,
  },

  time: {
    type: Date,
    default: Date.now,
  },

  status: {
    type: String,
    default: "Active",
  }

});

module.exports = mongoose.model("SOS", sosSchema);