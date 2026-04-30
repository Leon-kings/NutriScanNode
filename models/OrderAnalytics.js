const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["daily", "weekly"],
      required: true,
    },

    totalOrders: {
      type: Number,
      default: 0,
    },

    totalIncome: {
      type: Number,
      default: 0,
    },

    topPlates: [
      {
        name: String,
        quantity: Number,
      },
    ],

    leastPlates: [
      {
        name: String,
        quantity: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analytics", AnalyticsSchema);