const Order = require("../models/Order");

class OrderStatusManager {
  static orderTimeouts = new Map();

  static startOrderStatusUpdates(orderId) {
    // Clear old timeouts
    this.cleanupOrder(orderId);

    const preparing = setTimeout(async () => {
      await this.updateStatus(orderId, "preparing", "Kitchen is preparing your order!");
    }, 5000);

    const ready = setTimeout(async () => {
      await this.updateStatus(orderId, "ready", "Your order is ready!");
    }, 15000);

    const completed = setTimeout(async () => {
      await this.updateStatus(orderId, "completed", "Order completed!");
    }, 25000);

    this.orderTimeouts.set(`${orderId}_preparing`, preparing);
    this.orderTimeouts.set(`${orderId}_ready`, ready);
    this.orderTimeouts.set(`${orderId}_completed`, completed);
  }

  static async updateStatus(orderId, status, note) {
    const order = await Order.findOne({ orderId });
    if (!order) return;

    order.status = status;
    order.bookingDetails.currentStatus = status;

    order.bookingDetails.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      note,
    });

    await order.save();
  }

  static cleanupOrder(orderId) {
    ["preparing", "ready", "completed"].forEach((stage) => {
      const key = `${orderId}_${stage}`;
      if (this.orderTimeouts.has(key)) {
        clearTimeout(this.orderTimeouts.get(key));
      }
    });
  }
}

module.exports = OrderStatusManager;