const mongoose = require("mongoose");
module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected To DB chat app");
  } catch (error) {
    console.log("unconnected db", error);
  }
};



