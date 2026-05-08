

const mongoose = require("mongoose");
const crypto = require("crypto");

/* ================= ITEM ================= */
const ItemSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => crypto.randomUUID(),
    },

    name: { type: String, required: true, trim: true },

    quantity: { type: Number, default: 1, min: 1 },

    originalPrice: { type: Number, default: 0, min: 0 },

    finalPrice: { type: Number, default: 0, min: 0 },

    preparationTime: { type: Number, default: 0 },

    customizations: { type: [String], default: [] },

    specialInstructions: { type: String, default: "" },
  },
  { _id: false }
);

/* ================= STATUS ================= */
const StatusSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["preparing", "ready", "completed"],
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
    note: String,
  },
  { _id: false }
);

/* ================= ORDER ================= */
const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    requestId: {
      type: String,
      index: true,
      default: null,
    },

    personDetails: {
      name: { type: String, required: true, trim: true },
      tableNumber: { type: String, default: "" },
      orderType: {
        type: String,
        enum: ["dine-in", "takeaway"],
        default: "dine-in",
      },
    },

    bookingDetails: {
      estimatedPickupTime: { type: Date, default: null },

      specialInstructions: { type: String, default: "" },

      currentStatus: {
        type: String,
        enum: ["preparing", "ready", "completed"],
        default: "preparing",
      },

      statusHistory: {
        type: [StatusSchema],
        default: [
          {
            status: "preparing",
            note: "Order created",
          },
        ],
      },
    },

    items: {
      type: [ItemSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: "Order must contain at least one item",
      },
    },

    notes: { type: String, default: "" },

    status: {
      type: String,
      enum: ["preparing", "ready", "completed"],
      default: "preparing",
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);