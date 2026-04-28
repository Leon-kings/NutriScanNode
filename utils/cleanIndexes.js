// utils/cleanIndexes.js
const mongoose = require("mongoose");

async function cleanOrderIndexes() {
  const indexes = await mongoose.connection
    .collection("orders")
    .indexes();

  for (const index of indexes) {
    const name = index.name;

    if (
      name.includes("bookingDetails.bookingId") ||
      name.includes("bookingId")
    ) {
      console.log("🧹 Removing bad index:", name);
      await mongoose.connection
        .collection("orders")
        .dropIndex(name);
    }
  }
}

module.exports = cleanOrderIndexes;