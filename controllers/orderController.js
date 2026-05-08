
// const Order = require("../models/Order");
// const crypto = require("crypto");

// /* =====================================================
//    CREATE ORDER (SAFE + IDEMPOTENT)
// ===================================================== */

// exports.createOrder = async (req, res) => {
//   try {
//     const data = req.body;

//     /* ================= VALIDATION ================= */
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

//     /* ================= IDEMPOTENCY ================= */
//     const requestId =
//       data.requestId ||
//       req.headers["x-request-id"] ||
//       crypto.randomUUID();

//     const existing = await Order.findOne({ requestId });

//     if (existing) {
//       return res.status(200).json({
//         success: true,
//         message: "Duplicate prevented",
//         data: existing,
//       });
//     }

//     /* ================= SAFE DATE PARSING ================= */
//     let estimatedPickupTime = null;

//     const rawDate = data.bookingDetails?.estimatedPickupTime;

//     if (rawDate) {
//       const parsed = new Date(rawDate);

//       if (!isNaN(parsed.getTime())) {
//         estimatedPickupTime = parsed;
//       } else {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid estimatedPickupTime format",
//         });
//       }
//     }

//     /* ================= ORDER ID ================= */
//     const orderId = `ORD-${Date.now()}-${crypto.randomUUID()}`;

//     /* ================= BUILD ORDER ================= */
//     const order = await Order.create({
//       orderId,
//       requestId,

//       personDetails: {
//         name: data.personDetails.name,
//         tableNumber: data.personDetails.tableNumber || "",
//         orderType: data.personDetails.orderType || "dine-in",
//       },

//       bookingDetails: {
//         estimatedPickupTime,
//         specialInstructions:
//           data.bookingDetails?.specialInstructions || "",
//         currentStatus: "preparing",
//         statusHistory: [
//           {
//             status: "preparing",
//             note: "Order created",
//             timestamp: new Date(),
//           },
//         ],
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

//     /* ================= RESPONSE ================= */
//     return res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       data: order,
//     });
//   } catch (error) {
//     console.error("CREATE ORDER ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// /* =====================================================
//    GET ALL ORDERS
// ===================================================== */

// exports.getAllOrders = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = 20;

//     const orders = await Order.find()
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit);

//     return res.json({
//       success: true,
//       page,
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

// /* =====================================================
//    GET ORDER BY ID (SAFE + CLEAN)
// ===================================================== */
// exports.getOrderById = async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     const order = await Order.findOne({ orderId });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     return res.json({
//       success: true,
//       data: order,
//     });
//   } catch (error) {
//     console.error("GET ORDER ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// /* =====================================================
//    UPDATE ORDER STATUS (SAFE FLOW)
// ===================================================== */
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

//     const flow = {
//       preparing: ["ready"],
//       ready: ["completed"],
//       completed: [],
//     };

//     if (status) {
//       if (!flow[order.status]?.includes(status)) {
//         return res.status(400).json({
//           success: false,
//           message: `Invalid transition ${order.status} → ${status}`,
//         });
//       }

//       order.status = status;
//       order.bookingDetails.currentStatus = status;

//       order.bookingDetails.statusHistory.push({
//         status,
//         note: note || `Changed to ${status}`,
//         timestamp: new Date(),
//       });
//     }

//     await order.save();

//     return res.json({
//       success: true,
//       message: "Order updated",
//       data: order,
//     });
//   } catch (error) {
//     console.error("UPDATE ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// /* =====================================================
//    DELETE ORDER
// ===================================================== */
// exports.deleteOrder = async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     const order = await Order.findOneAndDelete({ orderId });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     return res.json({
//       success: true,
//       message: "Order deleted successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
















const Order = require("../models/Order");
const crypto = require("crypto");

/* =====================================================
   VALID STATUS FLOW
===================================================== */

const VALID_STATUSES = [
  "preparing",
  "ready",
  "completed",
];

const STATUS_FLOW = {
  preparing: ["ready"],
  ready: ["completed"],
  completed: [],
};

/* =====================================================
   CREATE ORDER
===================================================== */

exports.createOrder = async (req, res) => {
  try {
    const data = req.body;

    /* ================= VALIDATION ================= */

    if (!data?.personDetails?.name) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required",
      });
    }

    if (
      !Array.isArray(data.items) ||
      data.items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Order must contain at least one item",
      });
    }

    /* ================= IDEMPOTENCY ================= */

    const requestId =
      data.requestId ||
      req.headers["x-request-id"] ||
      crypto.randomUUID();

    const existingOrder = await Order.findOne({
      requestId,
    });

    if (existingOrder) {
      return res.status(200).json({
        success: true,
        message: "Duplicate prevented",
        data: existingOrder,
      });
    }

    /* ================= SAFE DATE ================= */

    let estimatedPickupTime = null;

    const rawDate =
      data.bookingDetails?.estimatedPickupTime;

    if (rawDate) {
      const parsedDate = new Date(rawDate);

      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid estimatedPickupTime format",
        });
      }

      estimatedPickupTime = parsedDate;
    }

    /* ================= ORDER ID ================= */

    const orderId = `ORD-${Date.now()}-${crypto.randomUUID()}`;

    /* ================= CREATE ORDER ================= */

    const order = await Order.create({
      orderId,
      requestId,

      personDetails: {
        name: data.personDetails.name,
        tableNumber:
          data.personDetails.tableNumber || "",
        orderType:
          data.personDetails.orderType ||
          "dine-in",
      },

      bookingDetails: {
        estimatedPickupTime,

        specialInstructions:
          data.bookingDetails
            ?.specialInstructions || "",

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

        originalPrice:
          item.originalPrice || 0,

        finalPrice: item.finalPrice || 0,

        preparationTime:
          item.preparationTime || 0,

        customizations:
          item.customizations || [],

        specialInstructions:
          item.specialInstructions || "",
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
    console.error(
      "CREATE ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   GET ALL ORDERS
===================================================== */

exports.getAllOrders = async (req, res) => {
  try {
    const page =
      parseInt(req.query.page) || 1;

    const limit =
      parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const totalOrders =
      await Order.countDocuments();

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(
        totalOrders / limit
      ),
      totalOrders,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error(
      "GET ALL ORDERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   GET ORDER BY ID
===================================================== */

exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      orderId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(
      "GET ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   EDIT ORDER
===================================================== */

exports.editOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const data = req.body;

    const order = await Order.findOne({
      orderId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    /* ================= SAFE DATE ================= */

    let estimatedPickupTime =
      order.bookingDetails
        ?.estimatedPickupTime || null;

    const rawDate =
      data.bookingDetails?.estimatedPickupTime;

    if (rawDate) {
      const parsedDate = new Date(rawDate);

      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid estimatedPickupTime format",
        });
      }

      estimatedPickupTime = parsedDate;
    }

    /* ================= PERSON DETAILS ================= */

    if (data.personDetails) {
      order.personDetails.name =
        data.personDetails.name ||
        order.personDetails.name;

      order.personDetails.tableNumber =
        data.personDetails.tableNumber ||
        order.personDetails.tableNumber;

      order.personDetails.orderType =
        data.personDetails.orderType ||
        order.personDetails.orderType;
    }

    /* ================= BOOKING DETAILS ================= */

    if (data.bookingDetails) {
      order.bookingDetails.estimatedPickupTime =
        estimatedPickupTime;

      order.bookingDetails.specialInstructions =
        data.bookingDetails
          .specialInstructions ||
        order.bookingDetails
          .specialInstructions;
    }

    /* ================= ITEMS ================= */

    if (
      Array.isArray(data.items) &&
      data.items.length > 0
    ) {
      order.items = data.items.map(
        (item) => ({
          id:
            item.id ||
            crypto.randomUUID(),

          name: item.name,

          quantity:
            item.quantity || 1,

          originalPrice:
            item.originalPrice || 0,

          finalPrice:
            item.finalPrice || 0,

          preparationTime:
            item.preparationTime || 0,

          customizations:
            item.customizations || [],

          specialInstructions:
            item.specialInstructions ||
            "",
        })
      );
    }

    /* ================= NOTES ================= */

    if (data.notes !== undefined) {
      order.notes = data.notes;
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    console.error(
      "EDIT ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   UPDATE ORDER STATUS
===================================================== */

exports.updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { orderId } = req.params;

    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (
      !VALID_STATUSES.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed statuses: ${VALID_STATUSES.join(
          ", "
        )}`,
      });
    }

    const order = await Order.findOne({
      orderId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const currentStatus = order.status;

    const allowedTransitions =
      STATUS_FLOW[currentStatus] || [];

    if (
      !allowedTransitions.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${currentStatus} to ${status}`,
      });
    }

    /* ================= UPDATE STATUS ================= */

    order.status = status;

    order.bookingDetails.currentStatus =
      status;

    order.bookingDetails.statusHistory.push(
      {
        status,
        note:
          note ||
          `Status changed to ${status}`,
        timestamp: new Date(),
      }
    );

    await order.save();

    return res.status(200).json({
      success: true,
      message:
        "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error(
      "UPDATE STATUS ERROR:",
      error
    );

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

    const order =
      await Order.findOneAndDelete({
        orderId,
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Order deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};