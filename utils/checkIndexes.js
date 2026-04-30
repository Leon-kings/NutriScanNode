const mongoose = require("mongoose");
require("dotenv").config();

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const indexes = await mongoose.connection.db
    .collection("orders")
    .indexes();

  console.log("📦 CURRENT INDEXES:");
  console.log(indexes);

  await mongoose.disconnect();
};

run();