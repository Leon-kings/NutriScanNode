// const Order = require("../models/Order");
// const OrderStatusManager = require("../utils/orderStatusManager");

// /**
//  * CREATE ORDER
//  */
// exports.createOrder = async (req, res) => {
//   try {
//     const orderData = req.body;

//     const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
//     const bookingId = `BK_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

//     const order = await Order.create({
//       orderId,
//       bookingId,

//       personDetails: {
//         name: orderData.customerName,
//         tableNumber: orderData.tableNumber,
//         orderType: orderData.orderType || "dine-in",
//       },

//       bookingDetails: {
//         orderDate: new Date().toISOString(),
//         estimatedPickupTime: orderData.estimatedPickupTime,
//         preparationStatus: "confirmed",
//         currentStatus: "confirmed",
//         statusHistory: [
//           {
//             status: "confirmed",
//             timestamp: new Date().toISOString(),
//             note: "Order confirmed",
//           },
//         ],
//         specialInstructions: orderData.notes || "",
//       },

//       plateRecommendations: orderData.customizedPlates || [],

//       orderSummary: {
//         items: orderData.items || [],
//         subtotal: orderData.subtotal,
//         total: orderData.total,
//         totalItems: (orderData.items || []).reduce(
//           (sum, i) => sum + i.quantity,
//           0
//         ),
//       },

//       metadata: {
//         source: "NutriScan-AI-App",
//         version: "1.0.0",
//         timestamp: new Date().toISOString(),
//       },
//     });

// if (orderData.autoProgress === true) {
//   OrderStatusManager.startOrderStatusUpdates(orderId);
// }

//     res.status(201).json({
//       success: true,
//       order,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /**
//  * GET ALL ORDERS
//  */
// exports.getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find().sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       count: orders.length,
//       orders,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /**
//  * GET SINGLE ORDER
//  */
// exports.getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findOne({ orderId: req.params.orderId });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     res.json({
//       success: true,
//       order,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /**
//  * UPDATE ORDER
//  */
// exports.updateOrder = async (req, res) => {
//   try {
//     const order = await Order.findOne({ orderId: req.params.orderId });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     // ⚠️ Prevent updating completed orders
//     if (order.status === "completed") {
//       return res.status(400).json({
//         success: false,
//         message: "Cannot update completed order",
//       });
//     }

//     // Update allowed fields
//     if (req.body.personDetails) {
//       order.personDetails = {
//         ...order.personDetails,
//         ...req.body.personDetails,
//       };
//     }

//     if (req.body.orderSummary) {
//       order.orderSummary = {
//         ...order.orderSummary,
//         ...req.body.orderSummary,
//       };
//     }

//     if (req.body.status) {
//       order.status = req.body.status;

//       order.bookingDetails.statusHistory.push({
//         status: req.body.status,
//         timestamp: new Date().toISOString(),
//         note: "Updated manually",
//       });

//       order.bookingDetails.currentStatus = req.body.status;
//     }

//     await order.save();

//     res.json({
//       success: true,
//       message: "Order updated",
//       order,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// exports.updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status, note } = req.body;

//     const order = await Order.findOne({ orderId });

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     // update only when explicitly called
//     order.bookingDetails.currentStatus = status;
//     order.bookingDetails.preparationStatus = status;

//     order.bookingDetails.statusHistory.push({
//       status,
//       timestamp: new Date().toISOString(),
//       note: note || `Order status changed to ${status}`,
//     });

//     await order.save();

//     res.status(200).json({
//       success: true,
//       order,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /**
//  * DELETE ORDER
//  */
// exports.deleteOrder = async (req, res) => {
//   try {
//     const order = await Order.findOne({ orderId: req.params.orderId });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     // cleanup timeouts
//     OrderStatusManager.cleanupOrder(order.orderId);

//     await order.deleteOne();

//     res.json({
//       success: true,
//       message: "Order deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const Order = require("../models/Order");
// const OrderStatusManager = require("../utils/orderStatusManager");

// /**
//  * CREATE ORDER
//  */
// // exports.createOrder = async (req, res) => {
// //   try {
// //     const orderData = req.body;

// //     // ✅ Basic validation
// //     if (!orderData.customerName || !orderData.items?.length) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Customer name and items are required",
// //       });
// //     }

// //     // 🆔 Generate IDs
// //     const orderId = `ORD_${Date.now()}_${Math.random()
// //       .toString(36)
// //       .substr(2, 9)
// //       .toUpperCase()}`;

// //     const bookingId = `BK_${Date.now()}_${Math.random()
// //       .toString(36)
// //       .substr(2, 6)
// //       .toUpperCase()}`;

// //     // 🧮 Safe calculations
// //     const items = orderData.items || [];

// //     const subtotal = items.reduce(
// //       (sum, i) => sum + (i.finalPrice || 0) * (i.quantity || 1),
// //       0
// //     );

// //     const totalItems = items.reduce(
// //       (sum, i) => sum + (i.quantity || 1),
// //       0
// //     );

// //     const total = subtotal;

// //     // 💾 Create order
// //     const order = await Order.create({
// //       orderId,
// //       bookingId,

// //       personDetails: {
// //         name: orderData.customerName,
// //         tableNumber: orderData.tableNumber || "",
// //         orderType: orderData.orderType || "dine-in",
// //       },

// //       bookingDetails: {
// //         orderDate: new Date(),
// //         estimatedPickupTime: orderData.estimatedPickupTime || "",
// //         preparationStatus: "confirmed",
// //         currentStatus: "confirmed",
// //         statusHistory: [
// //           {
// //             status: "confirmed",
// //             timestamp: new Date(),
// //             note: "Order created",
// //           },
// //         ],
// //         specialInstructions: orderData.notes || "",
// //       },

// //       plateRecommendations: orderData.customizedPlates || [],

// //       orderSummary: {
// //         items,
// //         subtotal,
// //         total,
// //         totalItems,
// //       },

// //       // 🔥 keep in sync always
// //       status: "confirmed",

// //       metadata: {
// //         source: "NutriScan-AI-App",
// //         version: "1.0.0",
// //         timestamp: new Date(),
// //       },
// //     });

// //     // 🔁 Auto progression
// //     if (orderData.autoProgress === true) {
// //       OrderStatusManager.startOrderStatusUpdates(order.orderId);
// //     }

// //     res.status(201).json({
// //       success: true,
// //       message: "Order created successfully",
// //       order,
// //     });
// //   } catch (error) {
// //     console.error("CREATE ORDER ERROR:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // exports.createOrder = async (req, res) => {
// //   try {
// //     const orderData = req.body;

// //     // ✅ validation
// //     if (!orderData.customerName || !orderData.items?.length) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Customer name and items are required",
// //       });
// //     }

// //     // 🆔 generate IDs
// //     const orderId = `ORD_${Date.now()}_${Math.random()
// //       .toString(36)
// //       .substr(2, 9)
// //       .toUpperCase()}`;

// //     const bookingId = `BK_${Date.now()}_${Math.random()
// //       .toString(36)
// //       .substr(2, 6)
// //       .toUpperCase()}`;

// //     // 🧮 calculate totals (backend trusted)
// //     const items = orderData.items || [];

// //     const subtotal = items.reduce(
// //       (sum, i) => sum + (i.finalPrice || 0) * (i.quantity || 1),
// //       0
// //     );

// //     const totalItems = items.reduce(
// //       (sum, i) => sum + (i.quantity || 1),
// //       0
// //     );

// //     const total = subtotal;

// //     // 💾 create order
// //     const order = await Order.create({
// //       orderId,
// //       bookingId,

// //       personDetails: {
// //         name: orderData.customerName,
// //         tableNumber: orderData.tableNumber || "",
// //         orderType: orderData.orderType || "dine-in",
// //       },

// //       bookingDetails: {
// //         orderDate: new Date(),
// //         estimatedPickupTime: orderData.estimatedPickupTime || "",
// //         preparationStatus: "confirmed",
// //         currentStatus: "confirmed",
// //         statusHistory: [
// //           {
// //             status: "confirmed",
// //             timestamp: new Date(),
// //             note: "Order created",
// //           },
// //         ],
// //         specialInstructions: orderData.notes || "",
// //       },

// //       plateRecommendations: orderData.customizedPlates || [],

// //       orderSummary: {
// //         items,
// //         subtotal,
// //         total,
// //         totalItems,
// //       },

// //       status: "confirmed",

// //       metadata: {
// //         source: "NutriScan-AI-App",
// //         version: "1.0.0",
// //         timestamp: new Date(),
// //       },
// //     });

// //     // 🔁 optional auto status progression
// //     if (orderData.autoProgress === true) {
// //       OrderStatusManager.startOrderStatusUpdates(order.orderId);
// //     }

// //     res.status(201).json({
// //       success: true,
// //       message: "Order created successfully",
// //       order,
// //     });
// //   } catch (error) {
// //     console.error("CREATE ORDER ERROR:", error);

// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // exports.createOrder = async (req, res) => {
// //   try {
// //     const orderData = req.body;

// //     if (!orderData.customerName) {
// //       return res.status(400).json({ success: false, message: "Customer name is required" });
// //     }

// //     if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
// //       return res.status(400).json({ success: false, message: "At least one item is required" });
// //     }

// //     const items = orderData.items.map((item) => ({
// //       id: item.id,
// //       name: item.name,
// //       quantity: item.quantity || 1,
// //       originalPrice: item.originalPrice || 0,
// //       finalPrice: item.finalPrice || 0,
// //       customizations: item.customizations || [],
// //       specialInstructions: item.specialInstructions || "",
// //       preparationTime: item.preparationTime || 0,
// //     }));

// //     const subtotal = items.reduce(
// //       (sum, i) => sum + i.finalPrice * i.quantity,
// //       0
// //     );

// //     const order = new Order({
// //       orderId: Order.generateOrderId(),
// //       bookingId: Order.generateBookingId(),

// //       personDetails: {
// //         name: orderData.customerName,
// //         tableNumber: orderData.tableNumber || "",
// //         orderType: orderData.orderType || "dine-in",
// //       },

// //       bookingDetails: {
// //         orderDate: new Date(),
// //         estimatedPickupTime: orderData.estimatedPickupTime || "",
// //         preparationStatus: "preparing",
// //         currentStatus: "preparing",
// //         statusHistory: [
// //           {
// //             status: "preparing",
// //             timestamp: new Date(),
// //             note: "Order created",
// //           },
// //         ],
// //         specialInstructions: orderData.notes || "",
// //       },

// //       plateRecommendations: orderData.customizedPlates || [],

// //       orderSummary: {
// //         items,
// //         subtotal,
// //         total: subtotal,
// //         totalItems: items.reduce((s, i) => s + i.quantity, 0),
// //       },

// //       status: "preparing",

// //       metadata: {
// //         source: "NutriScan-AI-App",
// //         version: "1.0.0",
// //         createdAt: new Date(),
// //       },
// //     });

// //     await order.save();

// //     return res.status(201).json({
// //       success: true,
// //       message: "Order created successfully",
// //       data: order,
// //     });

// //   } catch (error) {
// //     console.error("CREATE ORDER ERROR:", error);

// //     if (error.code === 11000) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Duplicate order detected. Please retry.",
// //       });
// //     }

// //     return res.status(500).json({
// //       success: false,
// //       message: "Failed to create order",
// //     });
// //   }
// // };

// /* -------------------------
//    CREATE ORDER
// -------------------------- */
// exports.createOrder = async (req, res) => {
//   try {
//     const orderData = req.body;

//     /* -------------------------
//        VALIDATION
//     -------------------------- */
//     if (!orderData.personDetails?.name && !orderData.customerName) {
//       return res.status(400).json({
//         success: false,
//         message: "Customer name is required",
//       });
//     }

//     if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Items must be a non-empty array",
//       });
//     }

//     /* -------------------------
//        BUILD ITEMS (SERVER TRUST)
//     -------------------------- */
//     const items = orderData.items.map((item) => ({
//       id: item.id,
//       name: item.name,
//       quantity: item.quantity || 1,
//       originalPrice: item.originalPrice || 0,
//       finalPrice: item.finalPrice || 0,
//       customizations: item.customizations || [],
//       specialInstructions: item.specialInstructions || "",
//       preparationTime: item.preparationTime || 0,
//     }));

//     const subtotal = items.reduce(
//       (sum, item) =>
//         sum + (item.finalPrice || 0) * (item.quantity || 1),
//       0
//     );

//     const totalItems = items.reduce(
//       (sum, item) => sum + (item.quantity || 1),
//       0
//     );

//     /* -------------------------
//        CREATE ORDER OBJECT
//     -------------------------- */
//     const order = new Order({
//       personDetails: {
//         name: orderData.customerName || orderData.personDetails?.name,
//         tableNumber: orderData.tableNumber || "",
//         orderType: orderData.orderType || "dine-in",
//       },

//       bookingDetails: {
//         orderDate: new Date(),
//         estimatedPickupTime: orderData.estimatedPickupTime || "",
//         preparationStatus: "preparing",
//         currentStatus: "preparing",
//         statusHistory: [
//           {
//             status: "preparing",
//             timestamp: new Date(),
//             note: "Order created",
//           },
//         ],
//         specialInstructions: orderData.notes || "",
//       },

//       plateRecommendations: orderData.customizedPlates || [],

//       orderSummary: {
//         items,
//         subtotal,
//         total: subtotal,
//         totalItems,
//       },

//       status: "preparing",

//       metadata: {
//         source: "API",
//         createdAt: new Date(),
//       },
//     });

//     /* -------------------------
//        SAVE (WITH DUPLICATE SAFETY)
//     -------------------------- */
//     try {
//       await order.save();
//     } catch (err) {
//       if (err.code === 11000) {
//         return res.status(409).json({
//           success: false,
//           message: "Duplicate order detected. Please retry.",
//           field: err.keyValue,
//         });
//       }
//       throw err;
//     }

//     /* -------------------------
//        RESPONSE
//     -------------------------- */
//     return res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       data: order,
//     });
//   } catch (error) {
//     console.error("CREATE ORDER ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to create order",
//     });
//   }
// };

// /**
//  * GET ALL ORDERS
//  */
// exports.getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find().sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       count: orders.length,
//       orders,
//     });
//   } catch (error) {
//     console.error("GET ALL ORDERS ERROR:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /**
//  * GET SINGLE ORDER
//  */
// exports.getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findOne({ orderId: req.params.orderId });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     res.json({
//       success: true,
//       order,
//     });
//   } catch (error) {
//     console.error("GET ORDER ERROR:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /**
//  * UPDATE ORDER
//  */
// // exports.updateOrder = async (req, res) => {
// //   try {
// //     const order = await Order.findOne({ orderId: req.params.orderId });

// //     if (!order) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Order not found",
// //       });
// //     }

// //     if (order.status === "completed") {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Cannot update completed order",
// //       });
// //     }

// //     // ✅ Update person details
// //     if (req.body.personDetails) {
// //       order.personDetails = {
// //         ...order.personDetails,
// //         ...req.body.personDetails,
// //       };
// //     }

// //     // ✅ Update items + recalc totals
// //     if (req.body.orderSummary?.items) {
// //       const items = req.body.orderSummary.items;

// //       const subtotal = items.reduce(
// //         (sum, i) => sum + (i.finalPrice || 0) * (i.quantity || 1),
// //         0
// //       );

// //       const totalItems = items.reduce(
// //         (sum, i) => sum + (i.quantity || 1),
// //         0
// //       );

// //       order.orderSummary = {
// //         ...order.orderSummary,
// //         items,
// //         subtotal,
// //         total: subtotal,
// //         totalItems,
// //       };
// //     }

// //     // ✅ Status update
// //     if (req.body.status) {
// //       order.status = req.body.status;
// //       order.bookingDetails.currentStatus = req.body.status;
// //       order.bookingDetails.preparationStatus = req.body.status;

// //       order.bookingDetails.statusHistory.push({
// //         status: req.body.status,
// //         timestamp: new Date(),
// //         note: "Updated manually",
// //       });
// //     }

// //     await order.save();

// //     res.json({
// //       success: true,
// //       message: "Order updated",
// //       order,
// //     });
// //   } catch (error) {
// //     console.error("UPDATE ORDER ERROR:", error);
// //     res.status(500).json({ success: false, message: error.message });
// //   }
// // };

// exports.updateOrder = async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     const order = await Order.findOne({ orderId });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     if (order.status === "completed") {
//       return res.status(400).json({
//         success: false,
//         message: "Cannot update completed order",
//       });
//     }

//     /* -------------------------
//        ✅ UPDATE PERSON DETAILS
//     -------------------------- */
//     if (req.body.personDetails) {
//       order.personDetails = {
//         ...order.personDetails,
//         ...req.body.personDetails,
//       };
//     }

//     /* -------------------------
//        ✅ UPDATE ITEMS (SAFE)
//     -------------------------- */
//     if (req.body.orderSummary?.items) {
//       order.orderSummary.items = req.body.orderSummary.items;
//       // ❗ totals auto-calculated in model (pre-save)
//     }

//     /* -------------------------
//        ✅ UPDATE NOTES / TIME
//     -------------------------- */
//     if (req.body.bookingDetails) {
//       order.bookingDetails = {
//         ...order.bookingDetails,
//         ...req.body.bookingDetails,
//       };
//     }

//     /* -------------------------
//        ✅ OPTIONAL STATUS UPDATE
//     -------------------------- */
//     if (req.body.status) {
//       order.status = req.body.status;

//       // push history manually (extra clarity)
//       order.bookingDetails.statusHistory.push({
//         status: req.body.status,
//         timestamp: new Date(),
//         note: req.body.notes || "Updated manually",
//       });
//     }

//     await order.save();

//     res.json({
//       success: true,
//       message: "Order updated successfully",
//       data: order,
//     });
//   } catch (error) {
//     console.error("UPDATE ORDER ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to update order",
//     });
//   }
// };

// /**
//  * UPDATE ORDER STATUS ONLY
//  */
// // exports.updateOrderStatus = async (req, res) => {
// //   try {
// //     const { orderId } = req.params;
// //     const { status, note } = req.body;

// //     const order = await Order.findOne({ orderId });

// //     if (!order) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Order not found",
// //       });
// //     }

// //     order.status = status;
// //     order.bookingDetails.currentStatus = status;
// //     order.bookingDetails.preparationStatus = status;

// //     order.bookingDetails.statusHistory.push({
// //       status,
// //       timestamp: new Date(),
// //       note: note || `Order status changed to ${status}`,
// //     });

// //     await order.save();

// //     res.json({
// //       success: true,
// //       message: "Order status updated",
// //       order,
// //     });
// //   } catch (error) {
// //     console.error("UPDATE STATUS ERROR:", error);
// //     res.status(500).json({ success: false, message: error.message });
// //   }
// // };

// exports.updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status, notes } = req.body; // ✅ matches frontend

//     if (!status) {
//       return res.status(400).json({
//         success: false,
//         message: "Status is required",
//       });
//     }

//     const order = await Order.findOne({ orderId });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     if (order.status === "completed") {
//       return res.status(400).json({
//         success: false,
//         message: "Order already completed",
//       });
//     }

//     /* -------------------------
//        ✅ UPDATE STATUS
//     -------------------------- */
//     order.status = status;

//     order.bookingDetails.currentStatus = status;
//     order.bookingDetails.preparationStatus = status;

//     order.bookingDetails.statusHistory.push({
//       status,
//       timestamp: new Date(),
//       note: notes || `Order status changed to ${status}`, // ✅ fixed
//     });

//     await order.save();

//     res.json({
//       success: true,
//       message: "Order status updated successfully",
//       data: order,
//     });
//   } catch (error) {
//     console.error("UPDATE STATUS ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to update status",
//     });
//   }
// };

// /**
//  * DELETE ORDER
//  */
// exports.deleteOrder = async (req, res) => {
//   try {
//     const order = await Order.findOne({ orderId: req.params.orderId });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     // 🧹 cleanup timers
//     OrderStatusManager.cleanupOrder(order.orderId);

//     await order.deleteOne();

//     res.json({
//       success: true,
//       message: "Order deleted successfully",
//     });
//   } catch (error) {
//     console.error("DELETE ORDER ERROR:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };











const Order = require("../models/Order");
const OrderStatusManager = require("../utils/orderStatusManager");
const { randomUUID } = require("crypto");

/* -------------------------
   CREATE ORDER
-------------------------- */
// exports.createOrder = async (req, res) => {
//   try {
//     const data = req.body;

//     /* -------------------------
//        VALIDATION
//     -------------------------- */
//     if (!data.personDetails?.name && !data.customerName) {
//       return res.status(400).json({
//         success: false,
//         message: "Customer name is required",
//       });
//     }

//     if (!Array.isArray(data.items) || data.items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Items must be a non-empty array",
//       });
//     }

//     /* -------------------------
//        GENERATE SAFE ORDER ID
//     -------------------------- */
//     const orderId = `ORD-${Date.now()}-${randomUUID()}`;

//     /* -------------------------
//        NORMALIZE ITEMS
//     -------------------------- */
//     const items = data.items.map((item) => ({
//       id: item.id,
//       name: item.name,
//       quantity: item.quantity || 1,
//       originalPrice: item.originalPrice || 0,
//       finalPrice: item.finalPrice || 0,
//       preparationTime: item.preparationTime || 0,
//       customizations: item.customizations || [],
//       specialInstructions: item.specialInstructions || "",
//     }));

//     /* -------------------------
//        CREATE ORDER
//     -------------------------- */
//     const order = new Order({
//       orderId,

//       autoProgress: data.autoProgress || false,

//       personDetails: {
//         name: data.customerName || data.personDetails?.name,
//         tableNumber: data.tableNumber || data.personDetails?.tableNumber || "",
//         orderType: data.orderType || data.personDetails?.orderType || "dine-in",
//       },

//       bookingDetails: {
//         estimatedPickupTime:
//           data.bookingDetails?.estimatedPickupTime ||
//           data.estimatedPickupTime ||
//           "",
//         specialInstructions:
//           data.bookingDetails?.specialInstructions || data.notes || "",

//         currentStatus: "confirmed",
//         statusHistory: [
//           {
//             status: "confirmed",
//             timestamp: new Date(),
//             note: "Order created",
//           },
//         ],
//       },

//       customizedPlates: data.customizedPlates || [],
//       items,
//       notes: data.notes || "",
//       status: "confirmed",
//     });

//     await order.save();

//     /* -------------------------
//        AUTO PROGRESS
//     -------------------------- */
//     if (data.autoProgress === true) {
//       OrderStatusManager.start(orderId);
//     }

//     return res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       data: order,
//     });
//   } catch (error) {
//     console.error("CREATE ORDER ERROR:", error);

//     if (error.code === 11000) {
//       return res.status(409).json({
//         success: false,
//         message: "Duplicate order detected. Please retry.",
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to create order",
//     });
//   }
// };

// exports.createOrder = async (req, res) => {
//   try {
//     const data = req.body;

//     console.log("📥 Incoming order request");

//     /* -------------------------
//        VALIDATION
//     -------------------------- */
//     if (!data.personDetails?.name && !data.customerName) {
//       return res.status(400).json({
//         success: false,
//         message: "Customer name is required",
//       });
//     }

//     if (!Array.isArray(data.items) || data.items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Items must be provided",
//       });
//     }

//     /* -------------------------
//        IDEMPOTENCY KEY (FIXED)
//     -------------------------- */
//     const requestId =
//       data.requestId || req.headers["x-request-id"];

//     if (!requestId) {
//       return res.status(400).json({
//         success: false,
//         message: "requestId is required",
//       });
//     }

//     console.log("🧠 requestId:", requestId);

//     // ✅ PROPER duplicate check BEFORE saving
//     const existingRequest = await Order.findOne({ requestId });

//     if (existingRequest) {
//       console.log("⚠️ Duplicate request detected");

//       return res.status(200).json({
//         success: true,
//         message: "Order already exists (idempotent)",
//         data: existingRequest,
//       });
//     }

//     /* -------------------------
//        ORDER ID (SAFER)
//     -------------------------- */
//     const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

//     console.log("🆔 orderId:", orderId);

//     /* -------------------------
//        NORMALIZE ITEMS
//     -------------------------- */
//     const items = data.items.map((item) => ({
//       id: item.id,
//       name: item.name,
//       quantity: item.quantity || 1,
//       originalPrice: item.originalPrice || 0,
//       finalPrice: item.finalPrice || 0,
//       preparationTime: item.preparationTime || 0,
//       customizations: item.customizations || [],
//       specialInstructions: item.specialInstructions || "",
//     }));

//     /* -------------------------
//        CREATE ORDER
//     -------------------------- */
//     const order = new Order({
//       orderId,
//       requestId,

//       autoProgress: data.autoProgress || false,

//       personDetails: {
//         name: data.customerName || data.personDetails?.name,
//         tableNumber: data.tableNumber || data.personDetails?.tableNumber || "",
//         orderType: data.orderType || data.personDetails?.orderType || "dine-in",
//       },

//       bookingDetails: {
//         estimatedPickupTime:
//           data.bookingDetails?.estimatedPickupTime || "",

//         specialInstructions:
//           data.bookingDetails?.specialInstructions || data.notes || "",

//         currentStatus: "confirmed",

//         statusHistory: [
//           {
//             status: "confirmed",
//             timestamp: new Date(),
//             note: "Order created",
//           },
//         ],
//       },

//       items,
//       notes: data.notes || "",
//       status: "confirmed",
//     });

//     /* -------------------------
//        SAVE WITH RACE SAFETY
//     -------------------------- */
//     try {
//       await order.save();
//       console.log("✅ Order saved successfully");

//       return res.status(201).json({
//         success: true,
//         message: "Order created successfully",
//         data: order,
//       });

//     } catch (err) {
//       console.error("❌ SAVE ERROR:", err);

//       if (err.code === 11000) {
//         const key = Object.keys(err.keyPattern || {})[0];

//         console.log("Duplicate key field:", key);

//         const existing = await Order.findOne({
//           [key]: err.keyValue[key],
//         });

//         return res.status(200).json({
//           success: true,
//           message: "Recovered duplicate order safely",
//           data: existing,
//         });
//       }

//       throw err;
//     }

//   } catch (error) {
//     console.error("🔥 CREATE ORDER ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to create order",
//     });
//   }
// };

// exports.createOrder = async (req, res) => {
//   try {
//     const data = req.body;

//     /* ---------------- VALIDATION ---------------- */
//     if (!data.personDetails?.name) {
//       return res.status(400).json({
//         success: false,
//         message: "Customer name is required",
//       });
//     }

//     if (!Array.isArray(data.items) || data.items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Items must be provided",
//       });
//     }

//     /* ---------------- REQUEST ID ---------------- */
//     let requestId =
//       data.requestId || req.headers["x-request-id"];

//     if (!requestId) {
//       requestId = crypto.randomUUID(); // fallback safety
//     }

//     console.log("🧠 requestId:", requestId);

//     /* ---------------- CHECK DUPLICATE (FAST PATH) ---------------- */
//     const existing = await Order.findOne({ requestId });

//     if (existing) {
//       return res.status(200).json({
//         success: true,
//         message: "Duplicate request (safe)",
//         data: existing,
//       });
//     }

//     /* ---------------- ORDER ID ---------------- */
//     const orderId = `ORD-${Date.now()}-${Math.floor(
//       Math.random() * 1e6
//     )}`;

//     /* ---------------- NORMALIZE ITEMS ---------------- */
//     const items = data.items.map((item) => ({
//       id: item.id,
//       name: item.name,
//       quantity: item.quantity || 1,
//       originalPrice: item.originalPrice || 0,
//       finalPrice: item.finalPrice || 0,
//       preparationTime: item.preparationTime || 0,
//       customizations: item.customizations || [],
//       specialInstructions: item.specialInstructions || "",
//     }));

//     /* ---------------- CREATE ORDER ---------------- */
//     const orderPayload = {
//       orderId,
//       requestId,
//       autoProgress: data.autoProgress || false,

//       personDetails: {
//         name: data.personDetails.name,
//         tableNumber: data.personDetails.tableNumber || "",
//         orderType: data.personDetails.orderType || "dine-in",
//       },

//       bookingDetails: {
//         estimatedPickupTime:
//           data.bookingDetails?.estimatedPickupTime || "",

//         specialInstructions:
//           data.bookingDetails?.specialInstructions || "",

//         currentStatus: "preparing", // ✅ default
//         statusHistory: [
//           {
//             status: "preparing",
//             note: "Order started",
//           },
//         ],
//       },

//       items,
//       notes: data.notes || "",
//       status: "preparing", // ✅ default
//     };

//     /* ---------------- SAVE (RACE SAFE) ---------------- */
//     try {
//       const order = await Order.create(orderPayload);

//       return res.status(201).json({
//         success: true,
//         message: "Order created",
//         data: order,
//       });
//     } catch (err) {
//       // 🔥 HANDLE DUPLICATE FROM UNIQUE INDEX
//       if (err.code === 11000 && err.keyPattern?.requestId) {
//         const existing = await Order.findOne({ requestId });

//         return res.status(200).json({
//           success: true,
//           message: "Duplicate recovered",
//           data: existing,
//         });
//       }

//       throw err;
//     }
//   } catch (error) {
//     console.error("🔥 CREATE ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


exports.createOrder = async (req, res) => {
  try {
    const data = req.body;

    if (!data.personDetails?.name) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required",
      });
    }

    if (!Array.isArray(data.items) || data.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Items required",
      });
    }

    /* ---------------- ID GENERATION ---------------- */
    const requestId =
      data.requestId ||
      req.headers["x-request-id"] ||
      crypto.randomUUID();

    const orderId = `ORD-${Date.now()}-${Math.floor(
      Math.random() * 1e6
    )}`;

    /* ---------------- PAYLOAD ---------------- */
    const payload = {
      orderId,
      requestId,

      personDetails: data.personDetails,

      bookingDetails: {
        estimatedPickupTime:
          data.bookingDetails?.estimatedPickupTime || "",
        specialInstructions:
          data.bookingDetails?.specialInstructions || "",
        currentStatus: "preparing",
        statusHistory: [
          {
            status: "preparing",
            note: "Order created",
          },
        ],
      },

      items: data.items,
      notes: data.notes || "",
      status: "preparing",
      autoProgress: data.autoProgress || false,
    };

    /* ---------------- ATOMIC UPSERT ---------------- */
    const order = await Order.findOneAndUpdate(
      { requestId },         // 🔒 key
      { $setOnInsert: payload },
      {
        new: true,
        upsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Order processed safely",
      data: order,
    });

  } catch (error) {
    console.error("🔥 ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* -------------------------
   GET ALL ORDERS
-------------------------- */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* -------------------------
   GET SINGLE ORDER
-------------------------- */
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("GET ORDER ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* -------------------------
   UPDATE ORDER
-------------------------- */
// exports.updateOrder = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const data = req.body;

//     const order = await Order.findOne({ orderId });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     if (order.status === "completed") {
//       return res.status(400).json({
//         success: false,
//         message: "Cannot update completed order",
//       });
//     }

//     /* -------------------------
//        UPDATE PERSON
//     -------------------------- */
//     if (data.personDetails) {
//       order.personDetails = {
//         ...order.personDetails,
//         ...data.personDetails,
//       };
//     }

//     /* -------------------------
//        UPDATE ITEMS
//     -------------------------- */
//     if (Array.isArray(data.items)) {
//       order.items = data.items;
//     }

//     /* -------------------------
//        UPDATE BOOKING
//     -------------------------- */
//     if (data.bookingDetails) {
//       order.bookingDetails = {
//         ...order.bookingDetails,
//         ...data.bookingDetails,
//       };
//     }

//     /* -------------------------
//        UPDATE STATUS
//     -------------------------- */
//     if (data.status) {
//       order.status = data.status;

//       order.bookingDetails.currentStatus = data.status;

//       order.bookingDetails.statusHistory.push({
//         status: data.status,
//         timestamp: new Date(),
//         note: data.notes || "Updated manually",
//       });
//     }

//     await order.save();

//     res.json({
//       success: true,
//       message: "Order updated successfully",
//       data: order,
//     });
//   } catch (error) {
//     console.error("UPDATE ORDER ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to update order",
//     });
//   }
// };

exports.updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    /* ---------------- VALID STATUS FLOW ---------------- */
    const validFlow = {
      preparing: ["ready"],
      ready: ["completed"],
      completed: [],
    };

    if (status) {
      const current = order.status;

      if (
        !validFlow[current] ||
        !validFlow[current].includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid status transition from ${current} to ${status}`,
        });
      }

      /* ---------------- UPDATE STATUS ---------------- */
      order.status = status;
      order.bookingDetails.currentStatus = status;

      order.bookingDetails.statusHistory.push({
        status,
        note: note || `Status changed to ${status}`,
        timestamp: new Date(),
      });
    }

    /* ---------------- SAVE ---------------- */
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order updated",
      data: order,
    });
  } catch (error) {
    console.error("🔥 UPDATE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* -------------------------
   UPDATE STATUS ONLY
-------------------------- */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;
    order.bookingDetails.currentStatus = status;

    order.bookingDetails.statusHistory.push({
      status,
      timestamp: new Date(),
      note: notes || `Order moved to ${status}`,
    });

    await order.save();

    res.json({
      success: true,
      message: "Status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update status",
    });
  }
};

/* -------------------------
   DELETE ORDER
-------------------------- */
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // cleanup timers
    OrderStatusManager.cleanup(order.orderId);

    await order.deleteOne();

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
