const mongoose = require("mongoose");

const StatusHistorySchema = new mongoose.Schema({
  status: String,
  timestamp: String,
  note: String,
});

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true },
    bookingId: String,

    personDetails: {
      name: String,
      tableNumber: String,
      orderType: { type: String, default: "dine-in" },
    },

    bookingDetails: {
      orderDate: String,
      estimatedPickupTime: String,
      preparationStatus: String,
      currentStatus: String,
      statusHistory: [StatusHistorySchema],
      specialInstructions: String,
    },

    plateRecommendations: [
      {
        plateId: String,
        originalName: String,
        customizations: Array,
        specialInstructions: String,
      },
    ],

    orderSummary: {
      items: [
        {
          id: String,
          name: String,
          quantity: Number,
          originalPrice: Number,
          finalPrice: Number,
          customizations: Array,
          specialInstructions: String,
          preparationTime: Number,
        },
      ],
      subtotal: Number,
      total: Number,
      totalItems: Number,
    },

    status: {
      type: String,
      enum: ["confirmed", "preparing", "ready", "completed"],
      default: "confirmed",
    },

    metadata: Object,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);