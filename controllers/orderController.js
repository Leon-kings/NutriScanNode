const Order = require("../models/Order");
const OrderStatusManager = require("../utils/orderStatusManager");

/**
 * CREATE ORDER
 */
exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;

    const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const bookingId = `BK_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const order = await Order.create({
      orderId,
      bookingId,

      personDetails: {
        name: orderData.customerName,
        tableNumber: orderData.tableNumber,
        orderType: orderData.orderType || "dine-in",
      },

      bookingDetails: {
        orderDate: new Date().toISOString(),
        estimatedPickupTime: orderData.estimatedPickupTime,
        preparationStatus: "confirmed",
        currentStatus: "confirmed",
        statusHistory: [
          {
            status: "confirmed",
            timestamp: new Date().toISOString(),
            note: "Order confirmed",
          },
        ],
        specialInstructions: orderData.notes || "",
      },

      plateRecommendations: orderData.customizedPlates || [],

      orderSummary: {
        items: orderData.items || [],
        subtotal: orderData.subtotal,
        total: orderData.total,
        totalItems: (orderData.items || []).reduce(
          (sum, i) => sum + i.quantity,
          0
        ),
      },

      metadata: {
        source: "NutriScan-AI-App",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
      },
    });

    OrderStatusManager.startOrderStatusUpdates(orderId);

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

    // ⚠️ Prevent updating completed orders
    if (order.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot update completed order",
      });
    }

    // Update allowed fields
    if (req.body.personDetails) {
      order.personDetails = {
        ...order.personDetails,
        ...req.body.personDetails,
      };
    }

    if (req.body.orderSummary) {
      order.orderSummary = {
        ...order.orderSummary,
        ...req.body.orderSummary,
      };
    }

    if (req.body.status) {
      order.status = req.body.status;

      order.bookingDetails.statusHistory.push({
        status: req.body.status,
        timestamp: new Date().toISOString(),
        note: "Updated manually",
      });

      order.bookingDetails.currentStatus = req.body.status;
    }

    await order.save();

    res.json({
      success: true,
      message: "Order updated",
      order,
    });
  } catch (error) {
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

    // cleanup timeouts
    OrderStatusManager.cleanupOrder(order.orderId);

    await order.deleteOne();

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};