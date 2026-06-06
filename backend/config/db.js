require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error(
        "MONGO_URI is not set. Add it to your .env file (do not hardcode credentials in source)."
      );
    }
    await mongoose.connect(mongoUri);
    console.log("mongodb connection success!");
  } catch (err) {
    console.log("mongodb connection failed!", err.message);
  }
};

module.exports = {
  connectDB,
};
