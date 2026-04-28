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

// const mongoose = require("mongoose");

// const StatusHistorySchema = new mongoose.Schema({
//   status: {
//     type: String,
//     enum: ["confirmed", "preparing", "ready", "completed"],
//     required: true,
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//   },
//   note: {
//     type: String,
//     default: "",
//   },
// });

// const OrderSchema = new mongoose.Schema(
//   {
//     orderId: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     bookingId: {
//       type: String,
//       required: true,
//       unique: true, // ✅ safe here (not inside bookingDetails)
//     },

//     personDetails: {
//       name: { type: String, required: true },
//       tableNumber: { type: String, default: "" },
//       orderType: {
//         type: String,
//         enum: ["dine-in", "takeaway", "delivery"],
//         default: "dine-in",
//       },
//     },

//     bookingDetails: {
//       orderDate: {
//         type: Date,
//         default: Date.now,
//       },

//       estimatedPickupTime: {
//         type: String,
//         default: "",
//       },

//       preparationStatus: {
//         type: String,
//         enum: ["confirmed", "preparing", "ready", "completed"],
//         default: "confirmed",
//       },

//       currentStatus: {
//         type: String,
//         enum: ["confirmed", "preparing", "ready", "completed"],
//         default: "confirmed",
//       },

//       statusHistory: {
//         type: [StatusHistorySchema],
//         default: [],
//       },

//       specialInstructions: {
//         type: String,
//         default: "",
//       },
//     },

//     plateRecommendations: {
//       type: [
//         {
//           plateId: String,
//           originalName: String,
//           customizations: {
//             type: [mongoose.Schema.Types.Mixed],
//             default: [],
//           },
//           specialInstructions: String,
//         },
//       ],
//       default: [],
//     },

//     orderSummary: {
//       items: {
//         type: [
//           {
//             id: String,
//             name: String,
//             quantity: { type: Number, default: 1 },
//             originalPrice: Number,
//             finalPrice: Number,
//             customizations: {
//               type: [mongoose.Schema.Types.Mixed],
//               default: [],
//             },
//             specialInstructions: String,
//             preparationTime: Number,
//           },
//         ],
//         default: [],
//       },

//       subtotal: { type: Number, default: 0 },
//       total: { type: Number, default: 0 },
//       totalItems: { type: Number, default: 0 },
//     },

//     // 🔥 single source of truth
//     status: {
//       type: String,
//       enum: ["confirmed", "preparing", "ready", "completed"],
//       default: "confirmed",
//     },

//     metadata: {
//       type: mongoose.Schema.Types.Mixed,
//       default: {},
//     },
//   },
//   { timestamps: true }
// );
// // 🔥 Fast lookup by orderId (most important)
// orderSchema.index({ orderId: 1 }, { unique: true });

// // 🔥 Fast lookup by bookingId
// orderSchema.index({ bookingId: 1 }, { unique: true });

// // 🔥 Dashboard filtering by status
// orderSchema.index({ status: 1 });

// // 🔥 Fast filtering by current preparation state
// orderSchema.index({ "bookingDetails.currentStatus": 1 });

// // 🔥 Fast latest orders (very important for admin panel)
// orderSchema.index({ createdAt: -1 });

// // 🔥 Combined index for dashboard queries (VERY powerful)
// orderSchema.index({
//   status: 1,
//   createdAt: -1,
// });

// // 🔥 If you filter by date range + status often
// orderSchema.index({
//   "bookingDetails.currentStatus": 1,
//   createdAt: -1,
// });
// module.exports = mongoose.model("Order", OrderSchema);

// const mongoose = require("mongoose");

// const StatusHistorySchema = new mongoose.Schema({
//   status: {
//     type: String,
//     enum: ["confirmed", "preparing", "ready", "completed"],
//     required: true,
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//   },
//   note: {
//     type: String,
//     default: "",
//   },
// });

// const OrderSchema = new mongoose.Schema(
//   {
//     orderId: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     bookingId: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     personDetails: {
//       name: { type: String, required: true },
//       tableNumber: { type: String, default: "" },
//       orderType: {
//         type: String,
//         enum: ["dine-in", "takeaway", "delivery"],
//         default: "dine-in",
//       },
//     },

//     bookingDetails: {
//       orderDate: { type: Date, default: Date.now },

//       estimatedPickupTime: { type: String, default: "" },

//       preparationStatus: {
//         type: String,
//         enum: ["confirmed", "preparing", "ready", "completed"],
//         default: "confirmed",
//       },

//       currentStatus: {
//         type: String,
//         enum: ["confirmed", "preparing", "ready", "completed"],
//         default: "confirmed",
//       },

//       statusHistory: {
//         type: [StatusHistorySchema],
//         default: [],
//       },

//       specialInstructions: {
//         type: String,
//         default: "",
//       },
//     },

//     plateRecommendations: {
//       type: [
//         {
//           plateId: String,
//           originalName: String,
//           customizations: {
//             type: [mongoose.Schema.Types.Mixed],
//             default: [],
//           },
//           specialInstructions: String,
//         },
//       ],
//       default: [],
//     },

//     orderSummary: {
//       items: {
//         type: [
//           {
//             id: String,
//             name: String,
//             quantity: { type: Number, default: 1 },
//             originalPrice: Number,
//             finalPrice: Number,
//             customizations: {
//               type: [mongoose.Schema.Types.Mixed],
//               default: [],
//             },
//             specialInstructions: String,
//             preparationTime: Number,
//           },
//         ],
//         default: [],
//       },

//       subtotal: { type: Number, default: 0 },
//       total: { type: Number, default: 0 },
//       totalItems: { type: Number, default: 0 },
//     },

//     status: {
//       type: String,
//       enum: ["confirmed", "preparing", "ready", "completed"],
//       default: "confirmed",
//     },

//     metadata: {
//       type: mongoose.Schema.Types.Mixed,
//       default: {},
//     },
//   },
//   { timestamps: true }
// );

// /* -------------------------
//    INDEXES (SAFE VERSION)
// -------------------------- */

// // Fast filters
// OrderSchema.index({ status: 1 });
// OrderSchema.index({ "bookingDetails.currentStatus": 1 });

// // Dashboard performance
// OrderSchema.index({ createdAt: -1 });
// OrderSchema.index({ status: 1, createdAt: -1 });
// OrderSchema.index({ "bookingDetails.currentStatus": 1, createdAt: -1 });

// module.exports = mongoose.model("Order", OrderSchema);

// const mongoose = require("mongoose");

// /* -------------------------
//    STATUS HISTORY
// -------------------------- */
// const StatusHistorySchema = new mongoose.Schema({
//   status: {
//     type: String,
//     enum: ["confirmed", "preparing", "ready", "completed"],
//     default: "preparing",
//     required: true,
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//   },
//   note: {
//     type: String,
//     default: "",
//   },
// });

// /* -------------------------
//    ITEM SUBSCHEMA (MATCH FRONTEND)
// -------------------------- */
// const ItemSchema = new mongoose.Schema({
//   id: String,
//   name: String,
//   quantity: { type: Number, default: 1 },
//   originalPrice: { type: Number, default: 0 },
//   finalPrice: { type: Number, default: 0 },
//   customizations: {
//     type: [mongoose.Schema.Types.Mixed],
//     default: [],
//   },
//   specialInstructions: String,
//   preparationTime: { type: Number, default: 0 },
// });

// /* -------------------------
//    MAIN ORDER SCHEMA
// -------------------------- */
// const OrderSchema = new mongoose.Schema(
//   {
//     orderId: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     bookingId: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     /* ✅ MATCHES: customerName, tableNumber, orderType */
//     personDetails: {
//       name: { type: String, required: true },
//       tableNumber: { type: String, default: "" },
//       orderType: {
//         type: String,
//         enum: ["dine-in", "takeaway", "delivery"],
//         default: "dine-in",
//       },
//     },

//     bookingDetails: {
//       orderDate: { type: Date, default: Date.now },
//       estimatedPickupTime: { type: String, default: "" },

//       preparationStatus: {
//         type: String,
//         enum: ["confirmed", "preparing", "ready", "completed"],
//         default: "preparing",
//       },

//       currentStatus: {
//         type: String,
//         enum: ["confirmed", "preparing", "ready", "completed"],
//         default: "preparing",
//       },

//       statusHistory: {
//         type: [StatusHistorySchema],
//         default: [],
//       },

//       specialInstructions: {
//         type: String,
//         default: "",
//       },
//     },

//     /* ✅ MATCHES: customizedPlates */
//     plateRecommendations: [
//       {
//         plateId: String,
//         originalName: String,
//         customizations: {
//           type: [mongoose.Schema.Types.Mixed],
//           default: [],
//         },
//         specialInstructions: String,
//       },
//     ],

//     /* ✅ MATCHES: items */
//     orderSummary: {
//       items: {
//         type: [ItemSchema],
//         default: [],
//       },

//       subtotal: { type: Number, default: 0 },
//       total: { type: Number, default: 0 },
//       totalItems: { type: Number, default: 0 },
//     },

//     status: {
//       type: String,
//       enum: ["confirmed", "preparing", "ready", "completed"],
//       default: "preparing",
//     },

//     metadata: {
//       type: mongoose.Schema.Types.Mixed,
//       default: {},
//     },
//   },
//   { timestamps: true },
// );

// /* -------------------------
//    SAFE INDEXES
// -------------------------- */

// OrderSchema.index({ status: 1 });
// OrderSchema.index({ createdAt: -1 });
// OrderSchema.index({ "bookingDetails.currentStatus": 1 });

// OrderSchema.index({ status: 1, createdAt: -1 });
// OrderSchema.index({ "bookingDetails.currentStatus": 1, createdAt: -1 });

// /* -------------------------
//    AUTO ID GENERATION (STRONGER)
// -------------------------- */

// OrderSchema.statics.generateOrderId = function () {
//   return `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
// };

// OrderSchema.statics.generateBookingId = function () {
//   return `BOOK-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
// };

// /* -------------------------
//    PRE-VALIDATION PROTECTION
// -------------------------- */

// OrderSchema.pre("validate", function (next) {
//   if (!this.orderId) {
//     this.orderId = this.constructor.generateOrderId();
//   }

//   if (!this.bookingId) {
//     this.bookingId = this.constructor.generateBookingId();
//   }

//   next();
// });

// /* -------------------------
//    AUTO CALCULATIONS (BACKEND TRUST)
// -------------------------- */

// OrderSchema.pre("save", function (next) {
//   if (this.orderSummary?.items?.length > 0) {
//     const subtotal = this.orderSummary.items.reduce(
//       (sum, item) => sum + (item.finalPrice || 0) * (item.quantity || 1),
//       0,
//     );

//     const totalItems = this.orderSummary.items.reduce(
//       (sum, item) => sum + (item.quantity || 1),
//       0,
//     );

//     this.orderSummary.subtotal = subtotal;
//     this.orderSummary.total = subtotal;
//     this.orderSummary.totalItems = totalItems;
//   }

//   next();
// });

// /* -------------------------
//    STATUS SYNC (IMPORTANT)
// -------------------------- */

// OrderSchema.pre("save", function (next) {
//   // Keep top-level status and bookingDetails in sync
//   if (this.isModified("status")) {
//     this.bookingDetails.currentStatus = this.status;

//     this.bookingDetails.statusHistory.push({
//       status: this.status,
//       timestamp: new Date(),
//       note: "Status updated",
//     });
//   }

//   next();
// });

// /* -------------------------
//    CLEANUP BROKEN INDEX
// -------------------------- */

// OrderSchema.statics.cleanupIndexes = async function () {
//   const indexes = await this.collection.indexes();

//   const badIndex = indexes.find((i) => i.name === "bookingDetails.bookingId_1");

//   if (badIndex) {
//     console.log("⚠️ Dropping broken index: bookingDetails.bookingId_1");
//     await this.collection.dropIndex("bookingDetails.bookingId_1");
//   }
// };

// module.exports = mongoose.model("Order", OrderSchema);

// const mongoose = require("mongoose");

// /* -------------------------
//    STATUS HISTORY
// -------------------------- */
// const StatusHistorySchema = new mongoose.Schema({
//   status: {
//     type: String,
//     enum: ["confirmed", "preparing", "ready", "completed"],
//     default: "preparing",
//     required: true,
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//   },
//   note: {
//     type: String,
//     default: "",
//   },
// });

// /* -------------------------
//    ITEM SUBSCHEMA
// -------------------------- */
// const ItemSchema = new mongoose.Schema({
//   id: String,
//   name: String,
//   quantity: { type: Number, default: 1 },
//   originalPrice: { type: Number, default: 0 },
//   finalPrice: { type: Number, default: 0 },
//   customizations: {
//     type: [mongoose.Schema.Types.Mixed],
//     default: [],
//   },
//   specialInstructions: String,
//   preparationTime: { type: Number, default: 0 },
// });

// /* -------------------------
//    MAIN ORDER SCHEMA
// -------------------------- */
// const OrderSchema = new mongoose.Schema(
//   {
//     orderId: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     bookingId: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     personDetails: {
//       name: { type: String, required: true },
//       tableNumber: { type: String, default: "" },
//       orderType: {
//         type: String,
//         enum: ["dine-in", "takeaway", "delivery"],
//         default: "dine-in",
//       },
//     },

//     bookingDetails: {
//       orderDate: { type: Date, default: Date.now },
//       estimatedPickupTime: { type: String, default: "" },

//       preparationStatus: {
//         type: String,
//         enum: ["confirmed", "preparing", "ready", "completed"],
//         default: "preparing",
//       },

//       currentStatus: {
//         type: String,
//         enum: ["confirmed", "preparing", "ready", "completed"],
//         default: "preparing",
//       },

//       statusHistory: {
//         type: [StatusHistorySchema],
//         default: [],
//       },

//       specialInstructions: {
//         type: String,
//         default: "",
//       },
//     },

//     plateRecommendations: [
//       {
//         plateId: String,
//         originalName: String,
//         customizations: {
//           type: [mongoose.Schema.Types.Mixed],
//           default: [],
//         },
//         specialInstructions: String,
//       },
//     ],

//     orderSummary: {
//       items: {
//         type: [ItemSchema],
//         default: [],
//       },
//       subtotal: { type: Number, default: 0 },
//       total: { type: Number, default: 0 },
//       totalItems: { type: Number, default: 0 },
//     },

//     status: {
//       type: String,
//       enum: ["confirmed", "preparing", "ready", "completed"],
//       default: "preparing",
//     },

//     metadata: {
//       type: mongoose.Schema.Types.Mixed,
//       default: {},
//     },
//   },
//   { timestamps: true }
// );

// /* -------------------------
//    INDEXES
// -------------------------- */
// OrderSchema.index({ status: 1 });
// OrderSchema.index({ createdAt: -1 });
// OrderSchema.index({ "bookingDetails.currentStatus": 1 });
// OrderSchema.index({ status: 1, createdAt: -1 });
// OrderSchema.index({ "bookingDetails.currentStatus": 1, createdAt: -1 });

// /* -------------------------
//    ID GENERATION
// -------------------------- */
// OrderSchema.statics.generateOrderId = function () {
//   return `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
// };

// OrderSchema.statics.generateBookingId = function () {
//   return `BOOK-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
// };

// /* -------------------------
//    PRE-VALIDATE (NO next)
// -------------------------- */
// OrderSchema.pre("validate", function () {
//   if (!this.orderId) {
//     this.orderId = this.constructor.generateOrderId();
//   }

//   if (!this.bookingId) {
//     this.bookingId = this.constructor.generateBookingId();
//   }
// });

// /* -------------------------
//    PRE-SAVE CALCULATIONS
// -------------------------- */
// OrderSchema.pre("save", function () {
//   if (this.orderSummary?.items?.length > 0) {
//     const subtotal = this.orderSummary.items.reduce(
//       (sum, item) => sum + (item.finalPrice || 0) * (item.quantity || 1),
//       0
//     );

//     const totalItems = this.orderSummary.items.reduce(
//       (sum, item) => sum + (item.quantity || 1),
//       0
//     );

//     this.orderSummary.subtotal = subtotal;
//     this.orderSummary.total = subtotal;
//     this.orderSummary.totalItems = totalItems;
//   }
// });

// /* -------------------------
//    STATUS SYNC
// -------------------------- */
// OrderSchema.pre("save", function () {
//   if (this.isModified("status")) {
//     this.bookingDetails.currentStatus = this.status;

//     this.bookingDetails.statusHistory.push({
//       status: this.status,
//       timestamp: new Date(),
//       note: "Status updated",
//     });
//   }
// });

// /* -------------------------
//    CLEANUP INDEX
// -------------------------- */
// OrderSchema.statics.cleanupIndexes = async function () {
//   const indexes = await this.collection.indexes();

//   const badIndex = indexes.find(
//     (i) => i.name === "bookingDetails.bookingId_1"
//   );

//   if (badIndex) {
//     console.log("⚠️ Dropping broken index: bookingDetails.bookingId_1");
//     await this.collection.dropIndex("bookingDetails.bookingId_1");
//   }
// };

// module.exports = mongoose.model("Order", OrderSchema);

// const mongoose = require("mongoose");

// /* -------------------------
//    STATUS HISTORY
// -------------------------- */
// const StatusHistorySchema = new mongoose.Schema({
//   status: {
//     type: String,
//     enum: ["confirmed", "preparing", "ready", "completed"],
//     default: "preparing",
//     required: true,
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//   },
//   note: {
//     type: String,
//     default: "",
//   },
// });

// /* -------------------------
//    ITEM SUBSCHEMA
// -------------------------- */
// const ItemSchema = new mongoose.Schema({
//   id: String,
//   name: String,
//   quantity: { type: Number, default: 1 },
//   originalPrice: { type: Number, default: 0 },
//   finalPrice: { type: Number, default: 0 },
//   customizations: {
//     type: [mongoose.Schema.Types.Mixed],
//     default: [],
//   },
//   specialInstructions: String,
//   preparationTime: { type: Number, default: 0 },
// });

// /* -------------------------
//    MAIN ORDER SCHEMA
// -------------------------- */
// const OrderSchema = new mongoose.Schema(
//   {
//     orderId: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     bookingId: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     personDetails: {
//       name: { type: String, required: true },
//       tableNumber: { type: String, default: "" },
//       orderType: {
//         type: String,
//         enum: ["dine-in", "takeaway", "delivery"],
//         default: "dine-in",
//       },
//     },

//     bookingDetails: {
//       orderDate: { type: Date, default: Date.now },
//       estimatedPickupTime: { type: String, default: "" },

//       preparationStatus: {
//         type: String,
//         enum: ["confirmed", "preparing", "ready", "completed"],
//         default: "preparing",
//       },

//       currentStatus: {
//         type: String,
//         enum: ["confirmed", "preparing", "ready", "completed"],
//         default: "preparing",
//       },

//       statusHistory: {
//         type: [StatusHistorySchema],
//         default: [],
//       },

//       specialInstructions: {
//         type: String,
//         default: "",
//       },
//     },

//     plateRecommendations: [
//       {
//         plateId: String,
//         originalName: String,
//         customizations: {
//           type: [mongoose.Schema.Types.Mixed],
//           default: [],
//         },
//         specialInstructions: String,
//       },
//     ],

//     orderSummary: {
//       items: {
//         type: [ItemSchema],
//         default: [],
//       },
//       subtotal: { type: Number, default: 0 },
//       total: { type: Number, default: 0 },
//       totalItems: { type: Number, default: 0 },
//     },

//     status: {
//       type: String,
//       enum: ["confirmed", "preparing", "ready", "completed"],
//       default: "preparing",
//     },

//     metadata: {
//       type: mongoose.Schema.Types.Mixed,
//       default: {},
//     },
//   },
//   { timestamps: true }
// );

// /* -------------------------
//    INDEXES
// -------------------------- */
// OrderSchema.index({ status: 1 });
// OrderSchema.index({ createdAt: -1 });
// OrderSchema.index({ "bookingDetails.currentStatus": 1 });
// OrderSchema.index({ status: 1, createdAt: -1 });
// OrderSchema.index({ "bookingDetails.currentStatus": 1, createdAt: -1 });

// /* -------------------------
//    ID GENERATION
// -------------------------- */
// OrderSchema.statics.generateOrderId = function () {
//   return `ORD-${Date.now()}-${Math.random()
//     .toString(36)
//     .slice(2, 8)
//     .toUpperCase()}`;
// };

// OrderSchema.statics.generateBookingId = function () {
//   return `BOOK-${Date.now()}-${Math.random()
//     .toString(36)
//     .slice(2, 6)
//     .toUpperCase()}`;
// };

// /* -------------------------
//    PRE-VALIDATE (FIXED)
// -------------------------- */
// OrderSchema.pre("validate", function (next) {
//   try {
//     if (!this.orderId) {
//       this.orderId = this.constructor.generateOrderId();
//     }

//     if (!this.bookingId) {
//       this.bookingId = this.constructor.generateBookingId();
//     }

//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// /* -------------------------
//    PRE-SAVE CALCULATIONS (FIXED)
// -------------------------- */
// OrderSchema.pre("save", function (next) {
//   try {
//     if (this.orderSummary?.items?.length > 0) {
//       const subtotal = this.orderSummary.items.reduce(
//         (sum, item) =>
//           sum + (item.finalPrice || 0) * (item.quantity || 1),
//         0
//       );

//       const totalItems = this.orderSummary.items.reduce(
//         (sum, item) => sum + (item.quantity || 1),
//         0
//       );

//       this.orderSummary.subtotal = subtotal;
//       this.orderSummary.total = subtotal;
//       this.orderSummary.totalItems = totalItems;
//     }

//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// /* -------------------------
//    STATUS SYNC (FIXED)
// -------------------------- */
// OrderSchema.pre("save", function (next) {
//   try {
//     if (this.isModified("status")) {
//       this.bookingDetails.currentStatus = this.status;

//       this.bookingDetails.statusHistory.push({
//         status: this.status,
//         timestamp: new Date(),
//         note: "Status updated",
//       });
//     }

//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// /* -------------------------
//    CLEANUP INDEX
// -------------------------- */
// OrderSchema.statics.cleanupIndexes = async function () {
//   const indexes = await this.collection.indexes();

//   const badIndex = indexes.find(
//     (i) => i.name === "bookingDetails.bookingId_1"
//   );

//   if (badIndex) {
//     console.log("⚠️ Dropping broken index: bookingDetails.bookingId_1");
//     await this.collection.dropIndex("bookingDetails.bookingId_1");
//   }
// };

// module.exports = mongoose.model("Order", OrderSchema);

// const mongoose = require("mongoose");
// const { randomUUID } = require("crypto");

// /* -------------------------
//    ITEM
// -------------------------- */
// const ItemSchema = new mongoose.Schema({
//   id: String,
//   name: String,
//   quantity: { type: Number, default: 1 },
//   originalPrice: Number,
//   finalPrice: Number,
//   preparationTime: Number,
//   customizations: { type: [String], default: [] },
//   specialInstructions: { type: String, default: "" },
// });

// /* -------------------------
//    PLATE
// -------------------------- */
// const CustomizedPlateSchema = new mongoose.Schema({
//   plateId: String,
//   originalName: String,
//   customizations: { type: [String], default: [] },
//   specialInstructions: { type: String, default: "" },
// });

// /* -------------------------
//    BOOKING DETAILS
// -------------------------- */
// const BookingDetailsSchema = new mongoose.Schema({
//   estimatedPickupTime: String,
//   specialInstructions: String,
// });

// /* -------------------------
//    PERSON DETAILS
// -------------------------- */
// const PersonDetailsSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   orderType: {
//     type: String,
//     enum: ["dine-in", "takeaway", "delivery"],
//     default: "dine-in",
//   },
//   tableNumber: String,
// });

// /* -------------------------
//    ORDER
// -------------------------- */
// const OrderSchema = new mongoose.Schema(
//   {
//     orderId: {
//       type: String,
//       unique: true, // ONLY UNIQUE FIELD
//       required: true,
//       index: true,
//     },

//     autoProgress: {
//       type: Boolean,
//       default: false,
//     },

//     bookingDetails: BookingDetailsSchema,
//     customizedPlates: { type: [CustomizedPlateSchema], default: [] },
//     items: { type: [ItemSchema], default: [] },
//     notes: String,
//     personDetails: PersonDetailsSchema,
//   },
//   { timestamps: true, strict: true },
// );

// /* -------------------------
//    SAFE ID GENERATION
// -------------------------- */
// OrderSchema.statics.generateOrderId = function () {
//   return `ORD-${Date.now()}-${randomUUID()}`;
// };

// /* -------------------------
//    AUTO SET ORDER ID (SAFE)
// -------------------------- */
// OrderSchema.pre("validate", function (next) {
//   if (!this.orderId) {
//     this.orderId = this.constructor.generateOrderId();
//   }
//   next();
// });

// /* -------------------------
//    REMOVE OLD BAD INDEXES (IMPORTANT)
// -------------------------- */
// OrderSchema.statics.fixIndexes = async function () {
//   const indexes = await this.collection.indexes();

//   for (const idx of indexes) {
//     // remove broken or legacy booking indexes
//     if (idx.name.includes("bookingDetails") || idx.name.includes("bookingId")) {
//       await this.collection.dropIndex(idx.name);
//       console.log("Removed index:", idx.name);
//     }
//   }
// };

// module.exports = mongoose.model("Order", OrderSchema);

// const mongoose = require("mongoose");
// const { randomUUID } = require("crypto");

// /* -------------------------
//    ITEM SCHEMA
// -------------------------- */
// const ItemSchema = new mongoose.Schema(
//   {
//     id: { type: String },
//     name: { type: String },

//     quantity: { type: Number, default: 1 },

//     originalPrice: { type: Number, default: 0 },
//     finalPrice: { type: Number, default: 0 },

//     preparationTime: { type: Number, default: 0 },

//     customizations: {
//       type: [String],
//       default: [],
//     },

//     specialInstructions: {
//       type: String,
//       default: "",
//     },
//   },
//   { _id: false },
// );

// /* -------------------------
//    CUSTOMIZED PLATE SCHEMA
// -------------------------- */
// const CustomizedPlateSchema = new mongoose.Schema(
//   {
//     plateId: { type: String },
//     originalName: { type: String },

//     customizations: {
//       type: [String],
//       default: [],
//     },

//     specialInstructions: {
//       type: String,
//       default: "",
//     },
//   },
//   { _id: false },
// );

// /* -------------------------
//    BOOKING DETAILS
// -------------------------- */
// const BookingDetailsSchema = new mongoose.Schema(
//   {
//     estimatedPickupTime: {
//       type: String,
//       default: "",
//     },

//     specialInstructions: {
//       type: String,
//       default: "",
//     },
//   },
//   { _id: false },
// );

// /* -------------------------
//    PERSON DETAILS
// -------------------------- */
// const PersonDetailsSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },

//     orderType: {
//       type: String,
//       enum: ["dine-in", "takeaway", "delivery"],
//       default: "dine-in",
//     },

//     tableNumber: {
//       type: String,
//       default: "",
//     },
//   },
//   { _id: false },
// );

// /* -------------------------
//    MAIN ORDER SCHEMA
// -------------------------- */
// const OrderSchema = new mongoose.Schema(
//   {
//     /* ✅ ONLY UNIQUE FIELD */
//     orderId: {
//       type: String,
//       required: true,
//       unique: true,
//       index: true,
//     },

//     autoProgress: {
//       type: Boolean,
//       default: false,
//     },

//     bookingDetails: {
//       type: BookingDetailsSchema,
//       default: {},
//     },

//     customizedPlates: {
//       type: [CustomizedPlateSchema],
//       default: [],
//     },

//     items: {
//       type: [ItemSchema],
//       default: [],
//     },

//     notes: {
//       type: String,
//       default: "",
//     },

//     personDetails: {
//       type: PersonDetailsSchema,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//     strict: true, // prevents unknown fields
//   },
// );

// /* -------------------------
//    SAFE ORDER ID GENERATION
// -------------------------- */
// OrderSchema.statics.generateOrderId = function () {
//   return `ORD-${Date.now()}-${randomUUID()}`;
// };

// /* -------------------------
//    AUTO GENERATE ID (NO DUPLICATES)
// -------------------------- */
// OrderSchema.pre("validate", function (next) {
//   if (!this.orderId) {
//     this.orderId = this.constructor.generateOrderId();
//   }
//   next();
// });

// /* -------------------------
//    CLEANUP BAD INDEXES (CRITICAL)
// -------------------------- */
// OrderSchema.statics.cleanupIndexes = async function () {
//   const indexes = await this.collection.indexes();

//   for (const idx of indexes) {
//     // remove any dangerous or legacy indexes
//     if (idx.name.includes("bookingId") || idx.name.includes("bookingDetails")) {
//       console.log("⚠️ Dropping bad index:", idx.name);
//       await this.collection.dropIndex(idx.name);
//     }
//   }
// };

// module.exports = mongoose.model("Order", OrderSchema);













// // models/Order.js
// const mongoose = require("mongoose");

// /* -------------------------
//    ITEM
// -------------------------- */
// const ItemSchema = new mongoose.Schema(
//   {
//     id: String,
//     name: String,
//     quantity: { type: Number, default: 1 },
//     originalPrice: { type: Number, default: 0 },
//     finalPrice: { type: Number, default: 0 },
//     preparationTime: { type: Number, default: 0 },
//     customizations: { type: [String], default: [] },
//     specialInstructions: { type: String, default: "" },
//   },
//   { _id: false },
// );

// /* -------------------------
//    PLATE
// -------------------------- */
// const PlateSchema = new mongoose.Schema(
//   {
//     plateId: String,
//     originalName: String,
//     customizations: { type: [String], default: [] },
//     specialInstructions: { type: String, default: "" },
//   },
//   { _id: false },
// );

// /* -------------------------
//    STATUS HISTORY
// -------------------------- */
// const StatusHistorySchema = new mongoose.Schema(
//   {
//     status: String,
//     timestamp: Date,
//     note: String,
//   },
//   { _id: false },
// );

// /* -------------------------
//    BOOKING
// -------------------------- */
// const BookingSchema = new mongoose.Schema(
//   {
//     estimatedPickupTime: String,
//     specialInstructions: String,

//     currentStatus: {
//       type: String,
//       enum: ["confirmed", "preparing", "ready", "completed"],
//       default: "confirmed",
//     },

//     statusHistory: {
//       type: [StatusHistorySchema],
//       default: [],
//     },
//   },
//   { _id: false },
// );

// /* -------------------------
//    PERSON
// -------------------------- */
// const PersonSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     orderType: {
//       type: String,
//       enum: ["dine-in", "takeaway", "delivery"],
//       default: "dine-in",
//     },
//     tableNumber: String,
//   },
//   { _id: false },
// );

// /* -------------------------
//    MAIN ORDER
// -------------------------- */
// const OrderSchema = new mongoose.Schema(
//   {
//     orderId: {
//       type: String,
//       required: true,
//       unique: true,
//       index: true,
//     },

//     autoProgress: {
//       type: Boolean,
//       default: false,
//     },

//     status: {
//       type: String,
//       enum: ["confirmed", "preparing", "ready", "completed"],
//       default: "confirmed",
//     },

//     bookingDetails: {
//       type: BookingSchema,
//       default: {},
//     },

//     customizedPlates: {
//       type: [PlateSchema],
//       default: [],
//     },

//     items: {
//       type: [ItemSchema],
//       default: [],
//     },

//     notes: {
//       type: String,
//       default: "",
//     },

//     personDetails: {
//       type: PersonSchema,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//     strict: true,
//   },
// );

// module.exports = mongoose.model("Order", OrderSchema);













// models/Order.js
const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    quantity: { type: Number, default: 1 },
    originalPrice: { type: Number, default: 0 },
    finalPrice: { type: Number, default: 0 },
    preparationTime: { type: Number, default: 0 },
    customizations: { type: [String], default: [] },
    specialInstructions: { type: String, default: "" },
  },
  { _id: false }
);

const StatusHistorySchema = new mongoose.Schema(
  {
    status: String,
    timestamp: Date,
    note: String,
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true, // DB-level protection
      index: true,
    },

    // 🔒 prevents duplicate requests (idempotency)
    requestId: {
      type: String,
      index: true,
    },

    autoProgress: Boolean,

    personDetails: {
      name: { type: String, required: true },
      tableNumber: String,
      orderType: String,
    },

    bookingDetails: {
      estimatedPickupTime: String,
      specialInstructions: String,

      currentStatus: {
        type: String,
        default: "confirmed",
      },

      statusHistory: {
        type: [StatusHistorySchema],
        default: [],
      },
    },

    items: {
      type: [ItemSchema],
      default: [],
    },

    notes: String,

    status: {
      type: String,
      default: "confirmed",
    },
  },
  { timestamps: true, strict: true }
);

module.exports = mongoose.model("Order", OrderSchema);