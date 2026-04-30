
// const Order = require("../models/Order");
// const OrderStatusManager = require("../utils/orderStatusManager");
// const { randomUUID } = require("crypto");

// /* -------------------------
//    CREATE ORDER
// -------------------------- */


// // exports.createOrder = async (req, res) => {
// //   try {
// //     const data = req.body;

// //     /* ---------------- VALIDATION ---------------- */
// //     if (!data?.personDetails?.name) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Customer name is required",
// //       });
// //     }

// //     if (!Array.isArray(data.items) || data.items.length === 0) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Order must contain at least one item",
// //       });
// //     }

// //     /* ---------------- IDEMPOTENCY ---------------- */
// //     const requestId =
// //       data.requestId ||
// //       req.headers["x-request-id"] ||
// //       crypto.randomUUID();

// //     /* ---------------- GENERATE ORDER ID ---------------- */
// //     const orderId = `ORD-${Date.now()}-${Math.floor(
// //       Math.random() * 1e6
// //     )}`;

// //     /* ---------------- BUILD CLEAN PAYLOAD ---------------- */
// //     const payload = {
// //       orderId,
// //       requestId,

// //       personDetails: {
// //         name: data.personDetails.name,
// //         tableNumber: data.personDetails.tableNumber || "",
// //         orderType: data.personDetails.orderType || "dine-in",
// //       },

// //       bookingDetails: {
// //         estimatedPickupTime: data.bookingDetails?.estimatedPickupTime
// //           ? new Date(data.bookingDetails.estimatedPickupTime)
// //           : null,
// //         specialInstructions:
// //           data.bookingDetails?.specialInstructions || "",
// //         currentStatus: "preparing",
// //         statusHistory: [
// //           {
// //             status: "preparing",
// //             note: "Order created",
// //           },
// //         ],
// //       },

// //       items: data.items.map((item) => ({
// //         id: item.id || crypto.randomUUID(), // 🔥 fixes your error
// //         name: item.name,
// //         quantity: item.quantity || 1,
// //         originalPrice: item.originalPrice || 0,
// //         finalPrice: item.finalPrice || 0,
// //         preparationTime: item.preparationTime || 0,
// //         customizations: item.customizations || [],
// //         specialInstructions: item.specialInstructions || "",
// //       })),

// //       notes: data.notes || "",
// //       status: "preparing",
// //     };

// //     /* ---------------- ATOMIC SAFE INSERT ---------------- */
// //     const order = await Order.findOneAndUpdate(
// //       { requestId },
// //       { $setOnInsert: payload },
// //       {
// //         new: true,
// //         upsert: true,
// //         runValidators: true,
// //       }
// //     );

// //     return res.status(201).json({
// //       success: true,
// //       message: "Order created successfully",
// //       data: order,
// //     });
// //   } catch (error) {
// //     if (error.code === 11000) {
// //       const existing = await Order.findOne({
// //         requestId: req.body.requestId,
// //       });

// //       return res.status(200).json({
// //         success: true,
// //         message: "Duplicate prevented",
// //         data: existing,
// //       });
// //     }

// //     return res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // exports.createOrder = async (req, res) => {
// //   try {
// //     const data = req.body;

// //     /* ---------------- VALIDATION ---------------- */
// //     if (!data?.personDetails?.name) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Customer name is required",
// //       });
// //     }

// //     if (!Array.isArray(data.items) || data.items.length === 0) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Order must contain at least one item",
// //       });
// //     }

// //     /* ---------------- IDEMPOTENCY ---------------- */
// //     const requestId =
// //       data.requestId ||
// //       req.headers["x-request-id"] ||
// //       crypto.randomUUID();

// //     /* ---------------- CHECK EXISTING (IDEMPOTENT) ---------------- */
// //     if (requestId) {
// //       const existing = await Order.findOne({ requestId });

// //       if (existing) {
// //         return res.status(200).json({
// //           success: true,
// //           message: "Duplicate prevented",
// //           data: existing,
// //         });
// //       }
// //     }

// //     /* ---------------- GENERATE ORDER ID ---------------- */
// //     const orderId = `ORD-${Date.now()}-${Math.floor(
// //       Math.random() * 1e6
// //     )}`;

// //     /* ---------------- BUILD PAYLOAD ---------------- */
// //     const payload = {
// //       orderId,
// //       requestId,

// //       personDetails: {
// //         name: data.personDetails.name,
// //         tableNumber: data.personDetails.tableNumber || "",
// //         orderType: data.personDetails.orderType || "dine-in",
// //       },

// //       bookingDetails: {
// //         estimatedPickupTime: data.bookingDetails?.estimatedPickupTime
// //           ? new Date(data.bookingDetails.estimatedPickupTime)
// //           : null,

// //         specialInstructions:
// //           data.bookingDetails?.specialInstructions || "",

// //         currentStatus: "preparing",

// //         statusHistory: [
// //           {
// //             status: "preparing",
// //             note: "Order created",
// //           },
// //         ],
// //       },

// //       items: data.items.map((item) => ({
// //         id: item.id || crypto.randomUUID(),
// //         name: item.name,
// //         quantity: item.quantity || 1,
// //         originalPrice: item.originalPrice || 0,
// //         finalPrice: item.finalPrice || 0,
// //         preparationTime: item.preparationTime || 0,
// //         customizations: item.customizations || [],
// //         specialInstructions: item.specialInstructions || "",
// //       })),

// //       notes: data.notes || "",
// //       status: "preparing",
// //     };

// //     /* ---------------- CREATE ---------------- */
// //     const order = await Order.create(payload);

// //     return res.status(201).json({
// //       success: true,
// //       message: "Order created successfully",
// //       data: order,
// //     });
// //   } catch (error) {
// //     /* ---------------- SAFETY NET ---------------- */
// //     if (error.code === 11000) {
// //       // extremely rare now (only if orderId collides)
// //       return res.status(409).json({
// //         success: false,
// //         message: "Duplicate order detected. Please retry.",
// //       });
// //     }

// //     return res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };



// exports.createOrder = async (req, res) => {
//   try {
//     const data = req.body;

//     /* ---------------- VALIDATION ---------------- */
//     if (!data?.personDetails?.name) {
//       return res.status(400).json({
//         success: false,
//         message: "Customer name is required",
//       });
//     }

//     if (!Array.isArray(data.items) || data.items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Order must contain at least one item",
//       });
//     }

//     /* ---------------- IDEMPOTENCY KEY ---------------- */
//     const requestId =
//       data.requestId ||
//       req.headers["x-request-id"] ||
//       crypto.randomUUID();

//     /* ---------------- CHECK EXISTING ORDER ---------------- */
//     const existingOrder = await Order.findOne({ requestId });

//     if (existingOrder) {
//       return res.status(200).json({
//         success: true,
//         message: "Duplicate prevented",
//         data: existingOrder,
//       });
//     }

//     /* ---------------- ORDER ID ---------------- */
//     const orderId = `ORD-${Date.now()}-${crypto.randomUUID()}`;

//     /* ---------------- BUILD ORDER ---------------- */
//     const order = await Order.create({
//       orderId,
//       requestId,

//       personDetails: {
//         name: data.personDetails.name,
//         tableNumber: data.personDetails.tableNumber || "",
//         orderType: data.personDetails.orderType || "dine-in",
//       },

//       bookingDetails: {
//         estimatedPickupTime: data.bookingDetails?.estimatedPickupTime
//           ? new Date(data.bookingDetails.estimatedPickupTime)
//           : null,

//         specialInstructions:
//           data.bookingDetails?.specialInstructions || "",

//         currentStatus: "preparing",
//       },

//       items: data.items.map((item) => ({
//         id: item.id || crypto.randomUUID(),
//         name: item.name,
//         quantity: item.quantity || 1,
//         originalPrice: item.originalPrice || 0,
//         finalPrice: item.finalPrice || 0,
//         preparationTime: item.preparationTime || 0,
//         customizations: item.customizations || [],
//         specialInstructions: item.specialInstructions || "",
//       })),

//       notes: data.notes || "",
//       status: "preparing",
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       data: order,
//     });
//   } catch (error) {
//     console.log("ORDER ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// /* -------------------------
//    GET ALL ORDERS
// -------------------------- */
// exports.getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find().sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       count: orders.length,
//       data: orders,
//     });
//   } catch (error) {
//     console.error("GET ALL ORDERS ERROR:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* -------------------------
//    GET SINGLE ORDER
// -------------------------- */
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
//       data: order,
//     });
//   } catch (error) {
//     console.error("GET ORDER ERROR:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* -------------------------
//    UPDATE ORDER
// -------------------------- */
// // exports.updateOrder = async (req, res) => {
// //   try {
// //     const { orderId } = req.params;
// //     const data = req.body;

// //     const order = await Order.findOne({ orderId });

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

// //     /* -------------------------
// //        UPDATE PERSON
// //     -------------------------- */
// //     if (data.personDetails) {
// //       order.personDetails = {
// //         ...order.personDetails,
// //         ...data.personDetails,
// //       };
// //     }

// //     /* -------------------------
// //        UPDATE ITEMS
// //     -------------------------- */
// //     if (Array.isArray(data.items)) {
// //       order.items = data.items;
// //     }

// //     /* -------------------------
// //        UPDATE BOOKING
// //     -------------------------- */
// //     if (data.bookingDetails) {
// //       order.bookingDetails = {
// //         ...order.bookingDetails,
// //         ...data.bookingDetails,
// //       };
// //     }

// //     /* -------------------------
// //        UPDATE STATUS
// //     -------------------------- */
// //     if (data.status) {
// //       order.status = data.status;

// //       order.bookingDetails.currentStatus = data.status;

// //       order.bookingDetails.statusHistory.push({
// //         status: data.status,
// //         timestamp: new Date(),
// //         note: data.notes || "Updated manually",
// //       });
// //     }

// //     await order.save();

// //     res.json({
// //       success: true,
// //       message: "Order updated successfully",
// //       data: order,
// //     });
// //   } catch (error) {
// //     console.error("UPDATE ORDER ERROR:", error);

// //     res.status(500).json({
// //       success: false,
// //       message: error.message || "Failed to update order",
// //     });
// //   }
// // };

// exports.updateOrder = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status, note } = req.body;

//     const order = await Order.findOne({ orderId });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     /* ---------------- VALID STATUS FLOW ---------------- */
//     const validFlow = {
//       preparing: ["ready"],
//       ready: ["completed"],
//       completed: [],
//     };

//     if (status) {
//       const current = order.status;

//       if (
//         !validFlow[current] ||
//         !validFlow[current].includes(status)
//       ) {
//         return res.status(400).json({
//           success: false,
//           message: `Invalid status transition from ${current} to ${status}`,
//         });
//       }

//       /* ---------------- UPDATE STATUS ---------------- */
//       order.status = status;
//       order.bookingDetails.currentStatus = status;

//       order.bookingDetails.statusHistory.push({
//         status,
//         note: note || `Status changed to ${status}`,
//         timestamp: new Date(),
//       });
//     }

//     /* ---------------- SAVE ---------------- */
//     await order.save();

//     return res.status(200).json({
//       success: true,
//       message: "Order updated",
//       data: order,
//     });
//   } catch (error) {
//     console.error("🔥 UPDATE ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// /* -------------------------
//    UPDATE STATUS ONLY
// -------------------------- */
// exports.updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status, notes } = req.body;

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

//     order.status = status;
//     order.bookingDetails.currentStatus = status;

//     order.bookingDetails.statusHistory.push({
//       status,
//       timestamp: new Date(),
//       note: notes || `Order moved to ${status}`,
//     });

//     await order.save();

//     res.json({
//       success: true,
//       message: "Status updated successfully",
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

// /* -------------------------
//    DELETE ORDER
// -------------------------- */
// exports.deleteOrder = async (req, res) => {
//   try {
//     const order = await Order.findOne({ orderId: req.params.orderId });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     // cleanup timers
//     OrderStatusManager.cleanup(order.orderId);

//     await order.deleteOne();

//     res.json({
//       success: true,
//       message: "Order deleted successfully",
//     });
//   } catch (error) {
//     console.error("DELETE ORDER ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };



















const Order = require("../models/Order");
const crypto = require("crypto");

/* =====================================================
   CREATE ORDER (SAFE + IDEMPOTENT)
===================================================== */
exports.createOrder = async (req, res) => {
  try {
    const data = req.body;

    /* ---------------- VALIDATION ---------------- */
    if (!data?.personDetails?.name) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required",
      });
    }

    if (!Array.isArray(data.items) || data.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    /* ---------------- IDEMPOTENCY KEY ---------------- */
    const requestId =
      data.requestId ||
      req.headers["x-request-id"] ||
      crypto.randomUUID();

    /* ---------------- CHECK DUPLICATE ---------------- */
    const existing = await Order.findOne({ requestId });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Duplicate prevented",
        data: existing,
      });
    }

    /* ---------------- ORDER ID ---------------- */
    const orderId = `ORD-${Date.now()}-${crypto.randomUUID()}`;

    /* ---------------- CREATE ORDER ---------------- */
    const order = await Order.create({
      orderId,
      requestId,

      personDetails: {
        name: data.personDetails.name,
        tableNumber: data.personDetails.tableNumber || "",
        orderType: data.personDetails.orderType || "dine-in",
      },

      bookingDetails: {
        estimatedPickupTime: data.bookingDetails?.estimatedPickupTime
          ? new Date(data.bookingDetails.estimatedPickupTime)
          : null,

        specialInstructions:
          data.bookingDetails?.specialInstructions || "",

        currentStatus: "preparing",

        statusHistory: [
          {
            status: "preparing",
            note: "Order created",
            timestamp: new Date(),
          },
        ],
      },

      items: data.items.map((item) => ({
        id: item.id || crypto.randomUUID(),
        name: item.name,
        quantity: item.quantity || 1,
        originalPrice: item.originalPrice || 0,
        finalPrice: item.finalPrice || 0,
        preparationTime: item.preparationTime || 0,
        customizations: item.customizations || [],
        specialInstructions: item.specialInstructions || "",
      })),

      notes: data.notes || "",
      status: "preparing",
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   GET ALL ORDERS
===================================================== */
// exports.getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find().sort({ createdAt: -1 });

//     return res.json({
//       success: true,
//       count: orders.length,
//       data: orders,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.json({
      success: true,
      page,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   GET ORDER BY ID (SAFE + CLEAN)
===================================================== */
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("GET ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   UPDATE ORDER STATUS (SAFE FLOW)
===================================================== */
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

    const flow = {
      preparing: ["ready"],
      ready: ["completed"],
      completed: [],
    };

    if (status) {
      if (!flow[order.status]?.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid transition ${order.status} → ${status}`,
        });
      }

      order.status = status;
      order.bookingDetails.currentStatus = status;

      order.bookingDetails.statusHistory.push({
        status,
        note: note || `Changed to ${status}`,
        timestamp: new Date(),
      });
    }

    await order.save();

    return res.json({
      success: true,
      message: "Order updated",
      data: order,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   DELETE ORDER
===================================================== */
exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOneAndDelete({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};