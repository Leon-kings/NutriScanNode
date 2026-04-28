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










const Order = require("../models/Order");
const OrderStatusManager = require("../utils/orderStatusManager");

/**
 * CREATE ORDER
 */
// exports.createOrder = async (req, res) => {
//   try {
//     const orderData = req.body;

//     // ✅ Basic validation
//     if (!orderData.customerName || !orderData.items?.length) {
//       return res.status(400).json({
//         success: false,
//         message: "Customer name and items are required",
//       });
//     }

//     // 🆔 Generate IDs
//     const orderId = `ORD_${Date.now()}_${Math.random()
//       .toString(36)
//       .substr(2, 9)
//       .toUpperCase()}`;

//     const bookingId = `BK_${Date.now()}_${Math.random()
//       .toString(36)
//       .substr(2, 6)
//       .toUpperCase()}`;

//     // 🧮 Safe calculations
//     const items = orderData.items || [];

//     const subtotal = items.reduce(
//       (sum, i) => sum + (i.finalPrice || 0) * (i.quantity || 1),
//       0
//     );

//     const totalItems = items.reduce(
//       (sum, i) => sum + (i.quantity || 1),
//       0
//     );

//     const total = subtotal;

//     // 💾 Create order
//     const order = await Order.create({
//       orderId,
//       bookingId,

//       personDetails: {
//         name: orderData.customerName,
//         tableNumber: orderData.tableNumber || "",
//         orderType: orderData.orderType || "dine-in",
//       },

//       bookingDetails: {
//         orderDate: new Date(),
//         estimatedPickupTime: orderData.estimatedPickupTime || "",
//         preparationStatus: "confirmed",
//         currentStatus: "confirmed",
//         statusHistory: [
//           {
//             status: "confirmed",
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
//         total,
//         totalItems,
//       },

//       // 🔥 keep in sync always
//       status: "confirmed",

//       metadata: {
//         source: "NutriScan-AI-App",
//         version: "1.0.0",
//         timestamp: new Date(),
//       },
//     });

//     // 🔁 Auto progression
//     if (orderData.autoProgress === true) {
//       OrderStatusManager.startOrderStatusUpdates(order.orderId);
//     }

//     res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       order,
//     });
//   } catch (error) {
//     console.error("CREATE ORDER ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;

    // ✅ validation
    if (!orderData.customerName || !orderData.items?.length) {
      return res.status(400).json({
        success: false,
        message: "Customer name and items are required",
      });
    }

    // 🆔 generate IDs
    const orderId = `ORD_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    const bookingId = `BK_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 6)
      .toUpperCase()}`;

    // 🧮 calculate totals (backend trusted)
    const items = orderData.items || [];

    const subtotal = items.reduce(
      (sum, i) => sum + (i.finalPrice || 0) * (i.quantity || 1),
      0
    );

    const totalItems = items.reduce(
      (sum, i) => sum + (i.quantity || 1),
      0
    );

    const total = subtotal;

    // 💾 create order
    const order = await Order.create({
      orderId,
      bookingId,

      personDetails: {
        name: orderData.customerName,
        tableNumber: orderData.tableNumber || "",
        orderType: orderData.orderType || "dine-in",
      },

      bookingDetails: {
        orderDate: new Date(),
        estimatedPickupTime: orderData.estimatedPickupTime || "",
        preparationStatus: "confirmed",
        currentStatus: "confirmed",
        statusHistory: [
          {
            status: "confirmed",
            timestamp: new Date(),
            note: "Order created",
          },
        ],
        specialInstructions: orderData.notes || "",
      },

      plateRecommendations: orderData.customizedPlates || [],

      orderSummary: {
        items,
        subtotal,
        total,
        totalItems,
      },

      status: "confirmed",

      metadata: {
        source: "NutriScan-AI-App",
        version: "1.0.0",
        timestamp: new Date(),
      },
    });

    // 🔁 optional auto status progression
    if (orderData.autoProgress === true) {
      OrderStatusManager.startOrderStatusUpdates(order.orderId);
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET ALL ORDERS
 */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET SINGLE ORDER
 */
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
      order,
    });
  } catch (error) {
    console.error("GET ORDER ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE ORDER
 */
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot update completed order",
      });
    }

    // ✅ Update person details
    if (req.body.personDetails) {
      order.personDetails = {
        ...order.personDetails,
        ...req.body.personDetails,
      };
    }

    // ✅ Update items + recalc totals
    if (req.body.orderSummary?.items) {
      const items = req.body.orderSummary.items;

      const subtotal = items.reduce(
        (sum, i) => sum + (i.finalPrice || 0) * (i.quantity || 1),
        0
      );

      const totalItems = items.reduce(
        (sum, i) => sum + (i.quantity || 1),
        0
      );

      order.orderSummary = {
        ...order.orderSummary,
        items,
        subtotal,
        total: subtotal,
        totalItems,
      };
    }

    // ✅ Status update
    if (req.body.status) {
      order.status = req.body.status;
      order.bookingDetails.currentStatus = req.body.status;
      order.bookingDetails.preparationStatus = req.body.status;

      order.bookingDetails.statusHistory.push({
        status: req.body.status,
        timestamp: new Date(),
        note: "Updated manually",
      });
    }

    await order.save();

    res.json({
      success: true,
      message: "Order updated",
      order,
    });
  } catch (error) {
    console.error("UPDATE ORDER ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE ORDER STATUS ONLY
 */
exports.updateOrderStatus = async (req, res) => {
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

    order.status = status;
    order.bookingDetails.currentStatus = status;
    order.bookingDetails.preparationStatus = status;

    order.bookingDetails.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Order status changed to ${status}`,
    });

    await order.save();

    res.json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE ORDER
 */
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 🧹 cleanup timers
    OrderStatusManager.cleanupOrder(order.orderId);

    await order.deleteOne();

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ORDER ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};