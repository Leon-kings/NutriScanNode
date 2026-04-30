const mongoose = require("mongoose");
require("dotenv").config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const collection = mongoose.connection.db.collection("orders");

    const indexes = await collection.indexes();
    console.log("📦 BEFORE:", indexes.map(i => i.name));

    // drop the bad index
    await collection.dropIndex("bookingDetails.orderId_1");

    console.log("✅ Removed: bookingDetails.orderId_1");

    const after = await collection.indexes();
    console.log("📦 AFTER:", after.map(i => i.name));

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
};

run();