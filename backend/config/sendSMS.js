const twilioClient = require("./twilio");

const sendSMS = async (to, message) => {

  try {

    if (!twilioClient) {
      throw new Error("Twilio client not initialized");
    }

    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: to
    });

    console.log("SMS sent to:", to);

  }
  catch (error) {

    console.error("Twilio SMS error:", error.message);

  }

};

module.exports = sendSMS;
