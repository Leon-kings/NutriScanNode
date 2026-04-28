// const mongoose = require("mongoose");

// const StatusHistorySchema = new mongoose.Schema({
//   status: String,
//   timestamp: String,
//   note: String,
// });

// const OrderSchema = new mongoose.Schema(
//   {
//     orderId: { type: String, unique: true },
//     bookingId: String,

//     personDetails: {
//       name: String,
//       tableNumber: String,
//       orderType: { type: String, default: "dine-in" },
//     },

//     bookingDetails: {
//       orderDate: String,
//       estimatedPickupTime: String,
//       preparationStatus: String,
//       currentStatus: String,
//       statusHistory: [StatusHistorySchema],
//       specialInstructions: String,
//     },

//     plateRecommendations: [
//       {
//         plateId: String,
//         originalName: String,
//         customizations: Array,
//         specialInstructions: String,
//       },
//     ],

//     orderSummary: {
//       items: [
//         {
//           id: String,
//           name: String,
//           quantity: Number,
//           originalPrice: Number,
//           finalPrice: Number,
//           customizations: Array,
//           specialInstructions: String,
//           preparationTime: Number,
//         },
//       ],
//       subtotal: Number,
//       total: Number,
//       totalItems: Number,
//     },

//     status: {
//       type: String,
//       enum: ["confirmed", "preparing", "ready", "completed"],
//       default: "confirmed",
//     },

//     metadata: Object,
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Order", OrderSchema);








const mongoose = require("mongoose");

const StatusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["confirmed", "preparing", "ready", "completed"],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
    default: "",
  },
});

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    bookingId: {
      type: String,
      required: true,
      unique: true, // ✅ safe here (not inside bookingDetails)
    },

    personDetails: {
      name: { type: String, required: true },
      tableNumber: { type: String, default: "" },
      orderType: {
        type: String,
        enum: ["dine-in", "takeaway", "delivery"],
        default: "dine-in",
      },
    },

    bookingDetails: {
      orderDate: {
        type: Date,
        default: Date.now,
      },

      estimatedPickupTime: {
        type: String,
        default: "",
      },

      preparationStatus: {
        type: String,
        enum: ["confirmed", "preparing", "ready", "completed"],
        default: "confirmed",
      },

      currentStatus: {
        type: String,
        enum: ["confirmed", "preparing", "ready", "completed"],
        default: "confirmed",
      },

      statusHistory: {
        type: [StatusHistorySchema],
        default: [],
      },

      specialInstructions: {
        type: String,
        default: "",
      },
    },

    plateRecommendations: {
      type: [
        {
          plateId: String,
          originalName: String,
          customizations: {
            type: [mongoose.Schema.Types.Mixed],
            default: [],
          },
          specialInstructions: String,
        },
      ],
      default: [],
    },

    orderSummary: {
      items: {
        type: [
          {
            id: String,
            name: String,
            quantity: { type: Number, default: 1 },
            originalPrice: Number,
            finalPrice: Number,
            customizations: {
              type: [mongoose.Schema.Types.Mixed],
              default: [],
            },
            specialInstructions: String,
            preparationTime: Number,
          },
        ],
        default: [],
      },

      subtotal: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
      totalItems: { type: Number, default: 0 },
    },

    // 🔥 single source of truth
    status: {
      type: String,
      enum: ["confirmed", "preparing", "ready", "completed"],
      default: "confirmed",
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);